/**
 * Reactive State Machine & Delegation Hub
 * Module: Reactive State Engine & Root Event Delegation (Milestone 3)
 *
 * Chức năng cốt lõi:
 * - Closure-encapsulated stateStore & cursor với resetCursor() trước mỗi render.
 * - Custom useState(initialValue) với slot capture và functional updater.
 * - Root Event Delegation:
 *   + Chỉ đăng ký đúng 1 native listener cho mỗi loại sự kiện (click, input,...) tại root.
 *   + Không bao giờ gắn addEventListener hoặc inline handler trực tiếp lên button/phần tử con.
 *   + Lưu trữ và quản lý event handlers qua WeakMap<Node, Record<string, Function>>.
 *   + Hỗ trợ event bubbling: click vào <span> bên trong <button> vẫn kích hoạt đúng handler của <button>.
 *   + Render lại nhiều lần không nhân bản listener tại root.
 *   + Node cũ bị thay thế tự động được dọn dẹp, không thể bị gọi handler cũ.
 */

import { createElement, createTextElement, isVNode } from "../exercise1/mini-react.js";

// Re-export createElement và createTextElement phục vụ tạo VNode
export { createElement, createTextElement, isVNode };

/**
 * WeakMap lưu trữ các event handlers cho từng DOM node.
 * Đảm bảo tự động dọn rác (GC) khi node bị gỡ khỏi DOM, không gây memory leak.
 * @type {WeakMap<Node, Record<string, Function>>}
 */
const elementHandlersMap = new WeakMap();

/**
 * Gán handler cho một DOM element theo event type.
 *
 * @param {Node} element - DOM element
 * @param {string} eventType - Loại sự kiện (ví dụ: 'click', 'input')
 * @param {Function} handler - Hàm xử lý sự kiện
 */
export function setElementHandler(element, eventType, handler) {
  let handlers = elementHandlersMap.get(element);
  if (!handlers) {
    handlers = Object.create(null);
    elementHandlersMap.set(element, handlers);
  }
  handlers[eventType] = handler;
}

/**
 * Lấy danh sách các handlers đã gán cho một DOM element.
 *
 * @param {Node} element
 * @returns {Record<string, Function> | undefined}
 */
export function getElementHandlers(element) {
  return elementHandlersMap.get(element);
}

/**
 * Chuyển đổi một VNode thành Real DOM Node tích hợp Root Event Delegation.
 * Tuyệt đối KHÔNG gọi dom.addEventListener hoặc gán thuộc tính on* lên element con.
 *
 * @param {object} vnode - Virtual DOM node
 * @param {object} [options]
 * @param {(eventType: string) => void} [options.onAttachEvent] - Callback thông báo loại event cần đăng ký tại root
 * @returns {Node} Real DOM Node
 */
export function renderToDOM(vnode, { onAttachEvent } = {}) {
  // 1. Kiểm tra VNode hợp lệ
  if (!isVNode(vnode)) {
    const details = typeof vnode === "object" ? JSON.stringify(vnode) : String(vnode);
    throw new TypeError(`[reactive-engine] Invalid VNode: ${details}`);
  }

  // 2. Text node dùng createTextNode (an toàn XSS)
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  // 3. Element node
  const dom = document.createElement(vnode.type);

  for (const [key, value] of Object.entries(vnode.props)) {
    if (key === "children") {
      continue;
    }

    // 4. Xử lý event props (onClick, onInput, onSubmit, ...):
    // Tuyệt đối KHÔNG gắn dom.addEventListener hoặc onclick attribute!
    // Lưu handler vào WeakMap để root delegation dispatcher xử lý.
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      if (typeof value !== "function") {
        throw new TypeError(
          `[reactive-engine] Expected event handler for prop '${key}' to be a function, but received: ${typeof value}`
        );
      }

      setElementHandler(dom, eventType, value);

      if (typeof onAttachEvent === "function") {
        onAttachEvent(eventType);
      }
      continue;
    }

    // 5. Thuộc tính class
    if (key === "className" || key === "class") {
      if (value != null && value !== false) {
        dom.setAttribute("class", String(value));
      }
      continue;
    }

    // 6. Thuộc tính style
    if (key === "style") {
      if (typeof value === "string") {
        dom.setAttribute("style", value);
      } else if (typeof value === "object" && value !== null) {
        Object.assign(dom.style, value);
      }
      continue;
    }

    // 7. Các thuộc tính HTML khác (bao gồm data-action, data-task-id, type, placeholder,...)
    if (value === true) {
      dom.setAttribute(key, "");
    } else if (value !== false && value != null) {
      dom.setAttribute(key, String(value));
    }
  }

  // 8. Render các phần tử con đệ quy
  for (const child of vnode.props.children) {
    const childDOM = renderToDOM(child, { onAttachEvent });
    dom.appendChild(childDOM);
  }

  return dom;
}

/**
 * Factory tạo một phiên bản Reactive Engine độc lập được đóng gói hoàn toàn bằng closure.
 *
 * @param {object} [options]
 * @param {object} [options.renderEngine] - Bộ render engine (mặc định sử dụng delegation renderToDOM)
 * @returns {object} Interface điều khiển reactive state engine
 */
export function createStateEngine({ renderEngine = { renderToDOM, isVNode } } = {}) {
  const stateStore = [];
  let cursor = 0;
  let rootComponent = null;
  let rootContainer = null;
  let renderCount = 0;
  let isRendering = false;
  const renderListeners = new Set();

  /**
   * Tập hợp các loại sự kiện đã được gắn native listener tại root.
   * Ngăn chặn việc gắn trùng lặp khi re-render nhiều lần.
   * @type {Set<string>}
   */
  const attachedRootEvents = new Set();

  /**
   * Dispatcher sự kiện tập trung tại root.
   * Khi sự kiện xảy ra tại bất kỳ phần tử con nào (hoặc span lồng trong button):
   * Duyệt ngược từ event.target lên root để tìm phần tử gần nhất có handler phù hợp.
   *
   * @param {Event} event - Native DOM Event
   */
  function dispatchRootEvent(event) {
    if (!rootContainer) {
      return;
    }

    // Ràng buộc quy tắc: Kiểm tra target phải thuộc rootContainer
    if (typeof rootContainer.contains === "function" && !rootContainer.contains(event.target)) {
      return;
    }

    let current = event.target;
    const eventType = event.type;

    // Duyệt ngược từ target lên đến rootContainer (mô phỏng event bubbling)
    while (current && current !== rootContainer && current !== document) {
      const handlers = getElementHandlers(current);
      if (handlers && typeof handlers[eventType] === "function") {
        handlers[eventType](event);
        return; // Đã tìm thấy và thực thi handler gần nhất
      }
      current = current.parentElement;
    }
  }

  /**
   * Đăng ký native listener tại root cho một loại event cụ thể (chỉ đăng ký 1 lần duy nhất).
   *
   * @param {string} eventType
   */
  function ensureRootListener(eventType) {
    if (!rootContainer || typeof rootContainer.addEventListener !== "function") {
      return;
    }

    if (!attachedRootEvents.has(eventType)) {
      rootContainer.addEventListener(eventType, dispatchRootEvent);
      attachedRootEvents.add(eventType);
    }
  }

  /**
   * Đưa con trỏ cursor về 0 trước mỗi lượt render mới.
   * Không xóa hoặc làm rỗng stateStore.
   */
  function resetCursor() {
    cursor = 0;
  }

  function getCursor() {
    return cursor;
  }

  function getSlotCount() {
    return stateStore.length;
  }

  function getRenderCount() {
    return renderCount;
  }

  function getStoreSnapshot() {
    return [...stateStore];
  }

  function getSlotValue(index) {
    if (index < 0 || index >= stateStore.length) {
      throw new RangeError(`[reactive-engine] Invalid slot index: ${index}`);
    }
    return stateStore[index];
  }

  function setSlotValue(index, value) {
    if (index < 0 || index >= stateStore.length) {
      throw new RangeError(`[reactive-engine] Invalid slot index: ${index}`);
    }
    const previousValue = stateStore[index];
    const nextValue = typeof value === "function" ? value(previousValue) : value;
    stateStore[index] = nextValue;
    return nextValue;
  }

  function allocateSlot(initialValue) {
    const slotIndex = cursor;
    if (slotIndex >= stateStore.length) {
      const value = typeof initialValue === "function" ? initialValue() : initialValue;
      stateStore.push(value);
    }
    cursor++;
    return {
      index: slotIndex,
      value: stateStore[slotIndex]
    };
  }

  /**
   * Dispatch quá trình render:
   * 1. Reset cursor về 0.
   * 2. Gọi rootComponent().
   * 3. Mount kết quả DOM vào rootContainer thông qua renderToDOM tích hợp delegation.
   * 4. Phát thông báo tới renderListeners.
   */
  function dispatchRender() {
    if (isRendering) {
      return;
    }
    isRendering = true;

    try {
      resetCursor();
      renderCount++;

      let output = null;
      if (typeof rootComponent === "function") {
        output = rootComponent();

        if (rootContainer && typeof document !== "undefined") {
          if (
            renderEngine &&
            typeof renderEngine.renderToDOM === "function" &&
            typeof renderEngine.isVNode === "function" &&
            renderEngine.isVNode(output)
          ) {
            // Render VNode sang DOM với delegation callback
            const domNode = renderEngine.renderToDOM(output, {
              onAttachEvent: (evt) => ensureRootListener(evt)
            });
            rootContainer.replaceChildren(domNode);
          } else if (typeof Node !== "undefined" && output instanceof Node) {
            rootContainer.replaceChildren(output);
          }
        }
      }

      for (const listener of renderListeners) {
        listener({ output, renderCount, stateStore: [...stateStore] });
      }

      return output;
    } finally {
      isRendering = false;
    }
  }

  /**
   * Đăng ký component gốc và container DOM.
   *
   * @param {Function} [component]
   * @param {HTMLElement} [container]
   * @returns {any}
   */
  function renderApp(component, container) {
    if (typeof component === "function") {
      rootComponent = component;
    }
    if (container !== undefined) {
      rootContainer = container;
      // Đảm bảo các sự kiện tiêu chuẩn luôn được lắng nghe tại root
      const standardEvents = ["click", "input", "change", "keydown", "submit"];
      for (const evt of standardEvents) {
        ensureRootListener(evt);
      }
    }
    return dispatchRender();
  }

  /**
   * Custom hook useState.
   *
   * @template T
   * @param {T | (() => T)} initialValue
   * @returns {[T, (action: T | ((prev: T) => T)) => void]}
   */
  function useState(initialValue) {
    const slotIndex = cursor;

    if (slotIndex >= stateStore.length) {
      const resolved = typeof initialValue === "function" ? initialValue() : initialValue;
      stateStore.push(resolved);
    }

    const value = stateStore[slotIndex];

    const setter = (action) => {
      const previousValue = stateStore[slotIndex];
      const nextValue = typeof action === "function" ? action(previousValue) : action;

      if (!Object.is(previousValue, nextValue)) {
        stateStore[slotIndex] = nextValue;
        dispatchRender();
      }
    };

    cursor++;
    return [value, setter];
  }

  function onRender(listener) {
    if (typeof listener === "function") {
      renderListeners.add(listener);
      return () => renderListeners.delete(listener);
    }
    return () => {};
  }

  function getAttachedRootEvents() {
    return Array.from(attachedRootEvents);
  }

  return {
    resetCursor,
    getCursor,
    allocateSlot,
    setSlotValue,
    getSlotValue,
    getStoreSnapshot,
    getSlotCount,
    getRenderCount,
    dispatchRender,
    renderApp,
    useState,
    onRender,
    dispatchRootEvent,
    ensureRootListener,
    getAttachedRootEvents
  };
}

// Khởi tạo instance mặc định của engine
const defaultEngine = createStateEngine();

export const resetCursor = defaultEngine.resetCursor;
export const getCursor = defaultEngine.getCursor;
export const allocateSlot = defaultEngine.allocateSlot;
export const setSlotValue = defaultEngine.setSlotValue;
export const getSlotValue = defaultEngine.getSlotValue;
export const getStoreSnapshot = defaultEngine.getStoreSnapshot;
export const getSlotCount = defaultEngine.getSlotCount;
export const getRenderCount = defaultEngine.getRenderCount;
export const dispatchRender = defaultEngine.dispatchRender;
export const renderApp = defaultEngine.renderApp;
export const useState = defaultEngine.useState;
export const onRender = defaultEngine.onRender;
export const dispatchRootEvent = defaultEngine.dispatchRootEvent;
export const ensureRootListener = defaultEngine.ensureRootListener;
export const getAttachedRootEvents = defaultEngine.getAttachedRootEvents;
