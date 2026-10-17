/**
 * Verification Test Suite for Milestone 3: root event delegation
 *
 * Tiêu chí kiểm thử:
 * 1. Chỉ đăng ký 1 native listener cho mỗi loại sự kiện tại root; re-render nhiều lần không tạo listener trùng.
 * 2. Không gắn native listener hoặc inline handler trực tiếp lên button và phần tử con.
 * 3. Click vào <span> bên trong <button> vẫn kích hoạt đúng handler của <button>.
 * 4. Không gọi handler cũ của node đã bị thay thế sau re-render.
 * 5. Một click chỉ gây một lần cập nhật sau nhiều lần render.
 */

import {
  createStateEngine,
  renderToDOM,
  createElement,
  createTextElement,
  getElementHandlers,
  setElementHandler
} from "./reactive-engine.js";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    testsFailed++;
  }
}

console.log("=== BẮT ĐẦU KIỂM THỬ MILESTONE 3 ===");

/**
 * Mock DOM Node hỗ trợ kiểm tra event delegation, hierarchy và addEventListener tracking
 */
class MockDOMElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.type = tagName.toLowerCase();
    this.props = {};
    this.children = [];
    this.parentElement = null;
    this.attributes = new Map();
    this.style = {};
    this.listeners = new Map(); // Theo dõi các listener native thực tế được gắn
  }

  setAttribute(key, value) {
    this.attributes.set(key, String(value));
  }

  getAttribute(key) {
    return this.attributes.get(key) || null;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  replaceChildren(...newChildren) {
    for (const c of this.children) {
      c.parentElement = null;
    }
    this.children = [];
    for (const c of newChildren) {
      if (c) {
        c.parentElement = this;
        this.children.push(c);
      }
    }
  }

  contains(node) {
    let curr = node;
    while (curr) {
      if (curr === this) return true;
      curr = curr.parentElement;
    }
    return false;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(event) {
    event.currentTarget = this;
    const handlers = this.listeners.get(event.type) || [];
    for (const h of handlers) {
      h(event);
    }
  }

  querySelector(selector) {
    if (selector === "button" && this.type === "button") return this;
    if (selector === "span" && this.type === "span") return this;
    for (const child of this.children) {
      if (child.querySelector) {
        const found = child.querySelector(selector);
        if (found) return found;
      }
    }
    return null;
  }
}

class MockTextNode {
  constructor(text) {
    this.nodeValue = String(text);
    this.parentElement = null;
  }
}

// Thiết lập môi trường DOM giả lập toàn cục cho bài test
global.document = {
  createElement: (tag) => new MockDOMElement(tag),
  createTextNode: (text) => new MockTextNode(text)
};

// -----------------------------------------------------------------------------
// Test 1: Không gắn native listener hay inline HTML handler trực tiếp lên button/span
// -----------------------------------------------------------------------------
console.log("\nTest 1: Button và span con không có native listener trực tiếp");
{
  let clicked = false;
  const vnode = createElement(
    "button",
    {
      id: "btn-test",
      onClick: () => {
        clicked = true;
      }
    },
    createElement("span", { className: "btn-icon" }, "★"),
    createElement("span", { className: "btn-text" }, "Click me")
  );

  const buttonDOM = renderToDOM(vnode);
  const spanIconDOM = buttonDOM.children[0];
  const spanTextDOM = buttonDOM.children[1];

  // Kiểm tra native listeners
  assert(buttonDOM.listeners.size === 0, "Button có 0 native event listener được gắn trực tiếp");
  assert(spanIconDOM.listeners.size === 0, "Span icon có 0 native event listener được gắn trực tiếp");
  assert(spanTextDOM.listeners.size === 0, "Span text có 0 native event listener được gắn trực tiếp");

  // Kiểm tra inline onclick attribute
  assert(buttonDOM.getAttribute("onclick") === null, "Button không có thuộc tính inline onclick");
  assert(buttonDOM.onclick === undefined, "Button không có thuộc tính DOM onclick");

  // Kiểm tra WeakMap lưu handler
  const handlers = getElementHandlers(buttonDOM);
  assert(typeof handlers?.click === "function", "Handler được lưu trong WeakMap của renderer");
}

// -----------------------------------------------------------------------------
// Test 2: Đăng ký native listener tại root và KHÔNG tạo listener trùng khi re-render
// -----------------------------------------------------------------------------
console.log("\nTest 2: Duy nhất 1 native listener tại root, không bị nhân bản khi re-render");
{
  const rootContainer = new MockDOMElement("div");
  const engine = createStateEngine({ renderEngine: { renderToDOM, isVNode: () => true } });

  function App() {
    const [count, setCount] = engine.useState(0);
    return createElement(
      "button",
      {
        onClick: () => setCount((c) => c + 1)
      },
      `Count: ${count}`
    );
  }

  // Render lần 1
  engine.renderApp(App, rootContainer);
  const clickListenersCountLượt1 = rootContainer.listeners.get("click")?.length || 0;
  assert(clickListenersCountLượt1 === 1, "Root có đúng 1 native click listener sau lần render đầu tiên");

  // Re-render thêm 5 lần
  for (let i = 0; i < 5; i++) {
    engine.renderApp();
  }

  const clickListenersCountLượt6 = rootContainer.listeners.get("click")?.length || 0;
  assert(clickListenersCountLượt6 === 1, "Root vẫn chỉ có đúng 1 native click listener sau 6 lần render");
}

// -----------------------------------------------------------------------------
// Test 3: Click vào span bên trong button vẫn tìm được handler của button
// -----------------------------------------------------------------------------
console.log("\nTest 3: Click vào span lồng trong button vẫn tìm thấy handler của button");
{
  const rootContainer = new MockDOMElement("div");
  const engine = createStateEngine({ renderEngine: { renderToDOM, isVNode: () => true } });
  let buttonClicked = false;
  let receivedEvent = null;

  function AppWithNestedSpan() {
    return createElement(
      "div",
      { className: "container" },
      createElement(
        "button",
        {
          id: "action-btn",
          onClick: (e) => {
            buttonClicked = true;
            receivedEvent = e;
          }
        },
        createElement("span", { id: "inner-icon" }, "🚀"),
        createElement("span", { id: "inner-label" }, "Launch")
      )
    );
  }

  engine.renderApp(AppWithNestedSpan, rootContainer);

  const containerDOM = rootContainer.children[0];
  const buttonDOM = containerDOM.children[0];
  const innerSpanDOM = buttonDOM.children[0];

  assert(innerSpanDOM.type === "span", "Đã tìm thấy phần tử span con");

  // Giả lập sự kiện click xuất phát từ innerSpanDOM (e.target = innerSpanDOM)
  const clickEvent = {
    type: "click",
    target: innerSpanDOM
  };

  // Dispatch event tại root
  rootContainer.dispatchEvent(clickEvent);

  assert(buttonClicked === true, "Handler của button được kích hoạt thành công khi click vào span");
  assert(receivedEvent.target === innerSpanDOM, "Event target vẫn giữ nguyên là phần tử span gốc");
}

// -----------------------------------------------------------------------------
// Test 4: Không gọi handler cũ của node đã bị thay thế & Một click = Một cập nhật
// -----------------------------------------------------------------------------
console.log("\nTest 4: Không gọi handler cũ của node bị thay thế & Một click gây đúng 1 lần cập nhật");
{
  const rootContainer = new MockDOMElement("div");
  const engine = createStateEngine({ renderEngine: { renderToDOM, isVNode: () => true } });
  let renderExecutionCount = 0;
  let historyCounts = [];

  function StatefulCounter() {
    const [count, setCount] = engine.useState(0);
    renderExecutionCount++;
    historyCounts.push(count);

    return createElement(
      "button",
      {
        id: `btn-${count}`,
        onClick: () => setCount((c) => c + 1)
      },
      createElement("span", {}, `Clicked ${count} times`)
    );
  }

  engine.renderApp(StatefulCounter, rootContainer);
  assert(renderExecutionCount === 1, "Render ban đầu: 1 lần");
  assert(historyCounts[historyCounts.length - 1] === 0, "Count ban đầu = 0");

  // Lấy button và span của lượt render 1
  const oldButtonDOM = rootContainer.children[0];
  const oldSpanDOM = oldButtonDOM.children[0];

  // Click lần 1 vào span
  rootContainer.dispatchEvent({ type: "click", target: oldSpanDOM });
  assert(renderExecutionCount === 2, "Sau click 1: Render đúng 1 lần mới (tổng = 2)");
  assert(historyCounts[historyCounts.length - 1] === 1, "Count tăng lên 1");

  // Lấy button và span mới sau lượt render 2
  const newButtonDOM = rootContainer.children[0];
  const newSpanDOM = newButtonDOM.children[0];
  assert(oldButtonDOM !== newButtonDOM, "Node button mới đã thay thế node button cũ");

  // Giả lập click vào node CŨ đã bị detached
  const renderCountBefore = renderExecutionCount;
  rootContainer.dispatchEvent({ type: "click", target: oldSpanDOM });
  assert(
    renderExecutionCount === renderCountBefore,
    "Click vào node cũ đã bị thay thế KHÔNG kích hoạt cập nhật state"
  );

  // Click vào node MỚI
  rootContainer.dispatchEvent({ type: "click", target: newSpanDOM });
  assert(renderExecutionCount === 3, "Click vào node mới kích hoạt đúng 1 lần cập nhật tiếp theo (tổng = 3)");
  assert(historyCounts[historyCounts.length - 1] === 2, "Count tăng lên 2");
}

console.log("\n=== KẾT QUẢ KIỂM THỬ ===");
console.log(`Đã vượt qua: ${testsPassed}/${testsPassed + testsFailed} assertions.`);
if (testsFailed === 0) {
  console.log(">> TẤT CẢ CÁC KIỂM THỬ MILESTONE 3 ĐÃ ĐẠT (PASSED) <<");
} else {
  console.error(">> CÓ LỖI XẢY RA TRONG KIỂM THỬ <<");
  process.exit(1);
}
