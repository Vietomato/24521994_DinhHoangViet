/**
 * Reactive State Machine & Delegation Hub
 * Module: Reactive State Engine & useState Dispatcher (Milestone 2)
 *
 * Chức năng cốt lõi:
 * - Đóng gói stateStore và cursor bên trong closure.
 * - Triển khai custom hook useState(initialValue) trả về [value, setter].
 * - Mỗi lần gọi useState chiếm một slot theo thứ tự ổn định của cursor.
 * - Setter capture cố định slotIndex của chính nó, không phụ thuộc cursor lúc setter chạy.
 * - Hỗ trợ cả giá trị trực tiếp và updater function: setter(prev => next).
 * - Tự động cập nhật store trước khi kích hoạt dispatchRender.
 * - Tự động resetCursor() về 0 trước mỗi lượt render.
 * - Áp dụng Object.is để tránh re-render thừa khi giá trị không đổi.
 * - Kết nối với render engine từ Exercise 1 (renderToDOM, isVNode).
 */

import { renderToDOM, isVNode } from "../exercise1/mini-react.js";

/**
 * Factory tạo một phiên bản Reactive Engine độc lập được đóng gói hoàn toàn bằng closure.
 *
 * @param {object} [options]
 * @param {object} [options.renderEngine] - Bộ render engine (mặc định tái sử dụng renderToDOM từ exercise1)
 * @returns {object} Interface điều khiển reactive state engine
 */
export function createStateEngine({ renderEngine = { renderToDOM, isVNode } } = {}) {
  /**
   * Bộ lưu trữ mảng các giá trị state, được bảo vệ bên trong closure.
   * @type {Array<any>}
   */
  const stateStore = [];

  /**
   * Con trỏ trỏ tới slot hiện tại trong chuỗi gọi hook.
   * @type {number}
   */
  let cursor = 0;

  /**
   * Component gốc đang được gắn vào engine.
   * @type {Function | null}
   */
  let rootComponent = null;

  /**
   * Container phần tử DOM đích để mount UI.
   * @type {HTMLElement | null}
   */
  let rootContainer = null;

  /**
   * Đếm tổng số lần render đã diễn ra.
   * @type {number}
   */
  let renderCount = 0;

  /**
   * Cờ kiểm soát tránh vòng lặp render vô tận khi setter bị gọi đồng bộ trong render.
   * @type {boolean}
   */
  let isRendering = false;

  /**
   * Danh sách listeners quan sát sự kiện render (phục vụ kiểm thử và debug).
   * @type {Set<Function>}
   */
  const renderListeners = new Set();

  /**
   * Đưa con trỏ cursor về 0 trước mỗi lượt render mới.
   * Không xóa hoặc làm rỗng stateStore.
   */
  function resetCursor() {
    cursor = 0;
  }

  /**
   * Lấy vị trí con trỏ hiện tại.
   * @returns {number}
   */
  function getCursor() {
    return cursor;
  }

  /**
   * Đếm tổng số slot đã được cấp phát trong stateStore.
   * @returns {number}
   */
  function getSlotCount() {
    return stateStore.length;
  }

  /**
   * Lấy tổng số lần đã dispatch render.
   * @returns {number}
   */
  function getRenderCount() {
    return renderCount;
  }

  /**
   * Lấy bản sao snapshot của stateStore (phục vụ kiểm thử, không can thiệp mảng gốc).
   * @returns {Array<any>}
   */
  function getStoreSnapshot() {
    return [...stateStore];
  }

  /**
   * Đọc giá trị tại một slot cụ thể.
   *
   * @param {number} index - Chỉ số slot
   * @returns {any}
   */
  function getSlotValue(index) {
    if (index < 0 || index >= stateStore.length) {
      throw new RangeError(`[reactive-engine] Invalid slot index: ${index}. Store size is ${stateStore.length}`);
    }
    return stateStore[index];
  }

  /**
   * Cập nhật giá trị tại một slot cụ thể theo chỉ số đã được capture.
   *
   * @param {number} index - Chỉ số slot cần cập nhật
   * @param {any} value - Giá trị mới hoặc updater function
   * @returns {any} Giá trị mới sau khi cập nhật
   */
  function setSlotValue(index, value) {
    if (index < 0 || index >= stateStore.length) {
      throw new RangeError(`[reactive-engine] Invalid slot index: ${index}. Store size is ${stateStore.length}`);
    }

    const previousValue = stateStore[index];
    const nextValue = typeof value === "function" ? value(previousValue) : value;
    stateStore[index] = nextValue;
    return nextValue;
  }

  /**
   * Phân bổ hoặc lấy slot state tại vị trí cursor hiện tại, sau đó tăng cursor.
   *
   * @param {any} initialValue - Giá trị khởi tạo cho slot nếu chưa có
   * @returns {{ index: number, value: any }} Chỉ số slot và giá trị hiện tại
   */
  function allocateSlot(initialValue) {
    const slotIndex = cursor;

    // Chỉ khởi tạo khi slot chưa tồn tại trong mảng
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
   * 1. Reset cursor về 0 trước khi gọi component.
   * 2. Tăng biến đếm renderCount.
   * 3. Thực thi rootComponent() thu được Virtual DOM / phần tử UI.
   * 4. Nếu có rootContainer và môi trường DOM, mount kết quả vào DOM.
   * 5. Phát thông báo cho các render listeners.
   *
   * @returns {any} Kết quả trả về của rootComponent
   */
  function dispatchRender() {
    if (isRendering) {
      return;
    }
    isRendering = true;

    try {
      // Bắt buộc: Reset cursor về 0 trước mỗi lần render
      resetCursor();
      renderCount++;

      let output = null;
      if (typeof rootComponent === "function") {
        output = rootComponent();

        // Nếu ở môi trường trình duyệt có document và container
        if (rootContainer && typeof document !== "undefined") {
          if (
            renderEngine &&
            typeof renderEngine.renderToDOM === "function" &&
            typeof renderEngine.isVNode === "function" &&
            renderEngine.isVNode(output)
          ) {
            const domNode = renderEngine.renderToDOM(output);
            rootContainer.replaceChildren(domNode);
          } else if (typeof Node !== "undefined" && output instanceof Node) {
            rootContainer.replaceChildren(output);
          }
        }
      }

      // Thông báo cho các listeners quan sát
      for (const listener of renderListeners) {
        listener({ output, renderCount, stateStore: [...stateStore] });
      }

      return output;
    } finally {
      isRendering = false;
    }
  }

  /**
   * Đăng ký component gốc và container DOM (nếu có), sau đó kích hoạt lượt render đầu tiên.
   * Có thể gọi renderApp() không đối số để kích hoạt re-render ứng dụng đã đăng ký.
   *
   * @param {Function} [component] - Hàm component gốc
   * @param {HTMLElement} [container] - Phần tử DOM chứa giao diện
   * @returns {any} Kết quả render
   */
  function renderApp(component, container) {
    if (typeof component === "function") {
      rootComponent = component;
    }
    if (container !== undefined) {
      rootContainer = container;
    }
    return dispatchRender();
  }

  /**
   * Custom useState Hook:
   * - Quản lý state theo slot tương ứng với cursor.
   * - Chỉ khởi tạo initialValue khi slot chưa tồn tại.
   * - Setter capture cố định slotIndex của chính nó trong closure.
   * - Hỗ trợ setter(newValue) và setter(previous => next).
   * - Cập nhật stateStore trước, sau đó kích hoạt render tự động.
   * - Bỏ qua re-render thừa nếu giá trị mới giống hệt giá trị cũ (Object.is).
   *
   * @template T
   * @param {T | (() => T)} initialValue - Giá trị khởi tạo
   * @returns {[T, (action: T | ((prev: T) => T)) => void]} Cặp [stateValue, setState]
   */
  function useState(initialValue) {
    const slotIndex = cursor;

    // Chỉ khởi tạo khi slot chưa tồn tại
    if (slotIndex >= stateStore.length) {
      const resolved = typeof initialValue === "function" ? initialValue() : initialValue;
      stateStore.push(resolved);
    }

    const value = stateStore[slotIndex];

    // Setter capture cố định chỉ số slotIndex của lần gọi hook này
    const setter = (action) => {
      const previousValue = stateStore[slotIndex];
      const nextValue = typeof action === "function" ? action(previousValue) : action;

      // Chính sách tối ưu: Chỉ kích hoạt render khi giá trị thực sự thay đổi (Object.is)
      if (!Object.is(previousValue, nextValue)) {
        stateStore[slotIndex] = nextValue;
        dispatchRender();
      }
    };

    cursor++;
    return [value, setter];
  }

  /**
   * Đăng ký callback theo dõi mỗi khi quá trình render hoàn tất.
   *
   * @param {Function} listener
   * @returns {Function} Hàm hủy đăng ký (unsubscribe)
   */
  function onRender(listener) {
    if (typeof listener === "function") {
      renderListeners.add(listener);
      return () => renderListeners.delete(listener);
    }
    return () => {};
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
    onRender
  };
}

// Khởi tạo instance mặc định của engine cho toàn ứng dụng
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
