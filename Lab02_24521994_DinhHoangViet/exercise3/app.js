/**
 * Application Entry Point
 * Exercise 3: Resilient State Machine & Skeleton Loader
 */

import { createStateEngine, renderToDOM } from "../exercise2/reactive-engine.js";
import { createDataFeedController, DataState } from "./data-feed-logic.js";
import { createDataFeedVNode } from "./data-feed-component.js";

// Khởi tạo State Engine cô lập cho Exercise 3
const engine = createStateEngine();
const { useState, onRender, ensureRootListener, resetCursor } = engine;

// Khởi tạo Controller điều phối DataFeed với custom useState
const feedController = createDataFeedController({ useState });

function App() {
  const { state, loadData, retry } = feedController.useDataFeed();
  const [shouldFailMode, setShouldFailMode] = useState(false);

  // Thao tác 1: Tải dữ liệu thông thường theo chế độ hiện tại
  const handleLoad = () => {
    console.log(`[DataFeed] Bắt đầu tải dữ liệu (Chế độ: ${shouldFailMode ? "Thất bại" : "Thành công"})...`);
    loadData({
      delay: 1500,
      shouldFail: shouldFailMode,
      errorMessage: "Máy chủ phản hồi mã lỗi 503: Dịch vụ tạm thời không khả dụng. Vui lòng bấm 'Retry Connection' để kết nối lại."
    });
  };

  // Thao tác 2: Thử lại kết nối
  const handleRetry = () => {
    console.log("[DataFeed] Đang thử lại kết nối (Retry Connection)...");
    retry({
      delay: 1500,
      shouldFail: shouldFailMode,
      errorMessage: "Máy chủ vẫn chưa phản hồi. Vui lòng kiểm tra lại."
    });
  };

  // Thao tác 3: Chuyển đổi chế độ mô phỏng lỗi
  const handleToggleFailMode = (isFail) => {
    setShouldFailMode(isFail);
    console.log(`[DataFeed] Đã đổi chế độ mô phỏng sang: ${isFail ? "THẤT BẠI (Error Mode)" : "THÀNH CÔNG (Success Mode)"}`);
  };

  // Thao tác 4: Kịch bản thử nghiệm Race Condition trực quan
  const handleRaceTest = () => {
    console.log("%c[Race Condition Test] Bắt đầu kích hoạt 2 request out-of-order...", "color: #2563eb; font-weight: bold;");

    // Request A: Chậm (1500ms)
    console.log("👉 Phát Request A (chậm, 1500ms)...");
    loadData({
      delay: 1500,
      data: [
        { id: "req-a", title: "Dữ liệu Request A (Gửi trước nhưng về sau)", category: "Stale Data", timestamp: "Cũ" }
      ]
    });

    // Sau 200ms, phát Request B: Nhanh (500ms)
    setTimeout(() => {
      console.log("👉 Phát Request B (nhanh, 500ms)...");
      loadData({
        delay: 500,
        data: [
          { id: "req-b-1", title: "Dữ liệu Request B - Mục 1 (Mới nhất)", category: "Active Data", timestamp: "Mới" },
          { id: "req-b-2", title: "Dữ liệu Request B - Mục 2 (Mới nhất)", category: "Active Data", timestamp: "Mới" }
        ]
      });
    }, 200);
  };

  return createDataFeedVNode({
    state,
    shouldFailMode,
    onToggleFailMode: handleToggleFailMode,
    onLoad: handleLoad,
    onRetry: handleRetry,
    onRaceTest: handleRaceTest
  });
}

// Khởi chạy và mount vào DOM
export function mountApplication() {
  const root = document.getElementById("app");
  if (!root) {
    console.error("Lỗi: Không tìm thấy phần tử #app để mount ứng dụng.");
    return;
  }

  // Đăng ký Root Event Delegation duy nhất tại #app
  ensureRootListener(root, "click");

  // Thiết lập hàm render tự động mỗi khi state thay đổi
  onRender(() => {
    resetCursor();
    const vnode = App();
    const domNode = renderToDOM(vnode);
    root.replaceChildren(domNode);
  });

  // Render lượt đầu tiên (trạng thái IDLE ban đầu)
  resetCursor();
  const initialVNode = App();
  const initialDOMNode = renderToDOM(initialVNode);
  root.replaceChildren(initialDOMNode);

  console.log("%c[DataFeed] Ứng dụng đã mount thành công tại #app!", "color: #16a34a; font-weight: bold;");
}

// Tự động khởi chạy khi tài liệu HTML sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountApplication);
} else {
  mountApplication();
}

