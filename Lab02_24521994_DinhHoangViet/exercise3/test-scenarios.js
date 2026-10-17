/**
 * Automated Verification Suite for the 7 Required Exercise 3 Scenarios
 * Tests all lifecycle states, interactive controls, and race condition immunity.
 */

import { createStateEngine } from "../exercise2/reactive-engine.js";
import { DataState, mockFetchData, createDataFeedController } from "./data-feed-logic.js";
import { createDataFeedVNode } from "./data-feed-component.js";

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition, message) {
  totalAssertions += 1;
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedAssertions += 1;
  console.log(`  ✔ [PASS] ${message}`);
}

// Helper tìm section hiển thị trạng thái hiện tại trong cây VNode
function getStateSection(vnode) {
  return vnode.props.children.find((child) => child?.props?.className?.includes("state-"));
}

async function run7Scenarios() {
  console.log("\n========================================================");
  console.log(" KIỂM THỬ TỰ ĐỘNG 7 TÌNH HUỐNG EXERCISE 3 (DATA FEED)");
  console.log("========================================================\n");

  const engine = createStateEngine();
  const { useState, resetCursor } = engine;
  const feedController = createDataFeedController({ useState, fetcher: mockFetchData });

  let shouldFailMode = false;

  function renderView() {
    resetCursor();
    const { state, loadData, retry } = feedController.useDataFeed();
    const [failMode, setFailMode] = useState(shouldFailMode);
    shouldFailMode = failMode;

    const vnode = createDataFeedVNode({
      state,
      shouldFailMode: failMode,
      onToggleFailMode: (val) => setFailMode(val),
      onLoad: () => loadData({ delay: 30, shouldFail: failMode }),
      onRetry: () => retry({ delay: 30, shouldFail: failMode }),
      onRaceTest: () => {}
    });

    return { state, vnode, loadData, retry, setFailMode };
  }

  // -------------------------------------------------------------------
  // Tình huống 1: Mở trang ban đầu -> IDLE
  // -------------------------------------------------------------------
  console.log("📌 Tình huống 1: Mở trang ban đầu (IDLE)");
  let current = renderView();
  assert(current.state.status === DataState.IDLE, "1.1. State ban đầu là IDLE");
  assert(current.state.data === null, "1.2. IDLE data bằng null");
  assert(current.state.error === null, "1.3. IDLE error bằng null");
  const idleSection = getStateSection(current.vnode);
  assert(
    idleSection !== undefined && idleSection.props.className.includes("state-idle"),
    "1.4. VNode render giao diện state-idle có hướng dẫn và nút bấm Load Data"
  );
  const getButtonText = (btn) => {
    if (!btn || !btn.props) return "";
    const children = btn.props.children;
    if (typeof children === "string") return children;
    if (Array.isArray(children)) {
      return children.map((c) => (c?.type === "TEXT_ELEMENT" ? c.props.nodeValue : String(c))).join("");
    }
    return "";
  };

  const loadBtn = idleSection.props.children.find((c) => c?.props?.className?.includes("btn-load"));
  assert(loadBtn !== undefined && getButtonText(loadBtn) === "Load Data", "1.5. Nút bấm mang nhãn chính xác 'Load Data'");

  // -------------------------------------------------------------------
  // Tình huống 2: Bấm Load Data -> LOADING và 4 Skeleton card xuất hiện
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 2: Bấm Load Data (LOADING & 4 Skeleton pulse cards)");
  const loadPromise = current.loadData({ delay: 50, shouldFail: false });
  current = renderView();
  assert(current.state.status === DataState.LOADING, "2.1. State lập tức chuyển sang LOADING");
  assert(current.state.data === null, "2.2. LOADING data bằng null");
  assert(current.state.error === null, "2.3. LOADING error bằng null");

  const loadingSection = getStateSection(current.vnode);
  assert(
    loadingSection !== undefined && loadingSection.props.className.includes("state-loading"),
    "2.4. VNode render giao diện state-loading"
  );
  assert(
    loadingSection.props["aria-busy"] === "true",
    "2.5. Section có thuộc tính aria-busy='true' phục vụ thông báo trợ năng"
  );

  const skeletonList = loadingSection.props.children.find((c) => c?.props?.className === "skeleton-list");
  assert(
    skeletonList !== undefined && skeletonList.props.children.length === 4,
    "2.6. Hiển thị chính xác 4 khối skeleton card theo yêu cầu"
  );
  assert(
    skeletonList.props.children[0].props.className.includes("pulse"),
    "2.7. Khung xương skeleton có class pulse phục vụ CSS animation"
  );

  // -------------------------------------------------------------------
  // Tình huống 3: Request thành công -> SUCCESS và Dữ liệu xuất hiện
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 3: Request thành công (SUCCESS & Live Data)");
  await loadPromise;
  current = renderView();
  assert(current.state.status === DataState.SUCCESS, "3.1. State chuyển sang SUCCESS");
  assert(Array.isArray(current.state.data) && current.state.data.length === 4, "3.2. Data chứa mảng 4 mục dữ liệu");
  assert(current.state.error === null, "3.3. SUCCESS error bằng null");

  const successSection = getStateSection(current.vnode);
  assert(
    successSection !== undefined && successSection.props.className.includes("state-success"),
    "3.4. VNode render giao diện state-success"
  );
  const feedList = successSection.props.children.find((c) => c?.props?.className === "feed-list");
  assert(feedList !== undefined && feedList.props.children.length === 4, "3.5. Hiển thị đủ 4 feed-item-card dữ liệu thực");

  const reloadBtn = successSection.props.children[0].props.children.find((c) => c?.props?.className?.includes("btn-reload"));
  assert(reloadBtn !== undefined, "3.6. Giao diện SUCCESS có nút tải lại (Reload)");

  // -------------------------------------------------------------------
  // Tình huống 4: Chọn chế độ thất bại rồi tải -> ERROR
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 4: Chọn chế độ thất bại rồi tải (ERROR & Retry Button)");
  current.setFailMode(true);
  current = renderView();
  assert(shouldFailMode === true, "4.1. Đã chuyển sang chế độ mô phỏng thất bại");

  const failPromise = current.loadData({
    delay: 40,
    shouldFail: true,
    errorMessage: "Lỗi kết nối máy chủ 503 Service Unavailable"
  });
  current = renderView();
  assert(current.state.status === DataState.LOADING, "4.2. Quá trình tải lỗi bắt đầu bằng LOADING");

  await failPromise;
  current = renderView();
  assert(current.state.status === DataState.ERROR, "4.3. State chuyển sang ERROR");
  assert(current.state.data === null, "4.4. ERROR data bằng null");
  assert(
    current.state.error === "Lỗi kết nối máy chủ 503 Service Unavailable",
    "4.5. ERROR chứa đúng thông điệp lỗi dễ hiểu"
  );

  const errorSection = getStateSection(current.vnode);
  assert(
    errorSection !== undefined && errorSection.props.className.includes("state-error"),
    "4.6. VNode render giao diện state-error"
  );
  assert(
    errorSection.props.role === "alert",
    "4.7. Thẻ state-error có thuộc tính role='alert' chuẩn trợ năng W3C"
  );

  const retryBtn = errorSection.props.children.find((c) => c?.props?.className?.includes("btn-retry"));
  assert(
    retryBtn !== undefined && getButtonText(retryBtn) === "Retry Connection",
    "4.8. Giao diện có nút mang nhãn chính xác 'Retry Connection'"
  );

  // -------------------------------------------------------------------
  // Tình huống 5: Chuyển sang thành công, bấm Retry Connection -> LOADING rồi SUCCESS
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 5: Chuyển sang thành công & Bấm Retry (LOADING -> SUCCESS)");
  current.setFailMode(false);
  current = renderView();

  const retryPromise = current.retry({ delay: 40, shouldFail: false });
  current = renderView();
  assert(current.state.status === DataState.LOADING, "5.1. Bấm Retry lập tức chuyển sang LOADING");

  await retryPromise;
  current = renderView();
  assert(current.state.status === DataState.SUCCESS, "5.2. Retry thành công chuyển sang SUCCESS");
  assert(Array.isArray(current.state.data) && current.state.data.length === 4, "5.3. Dữ liệu phục hồi thành công");
  assert(current.state.error === null, "5.4. Error bị xóa về null");

  // -------------------------------------------------------------------
  // Tình huống 6: Race condition: A chậm (dữ liệu A) vs B nhanh (dữ liệu B) -> UI hiển thị B
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 6: Race Condition (A chậm vs B nhanh -> UI hiển thị B)");
  const pA = current.loadData({
    delay: 120,
    data: [{ id: "data-a", title: "Dữ liệu A (Request cũ về sau)", category: "Stale", timestamp: "Cũ" }]
  });
  const idA = feedController.getLatestRequestId();

  const pB = current.loadData({
    delay: 30,
    data: [{ id: "data-b", title: "Dữ liệu B (Request mới về trước)", category: "Fresh", timestamp: "Mới" }]
  });
  const idB = feedController.getLatestRequestId();

  assert(idB > idA, "6.1. Request B có ID mới hơn Request A");

  // B về trước
  await pB;
  current = renderView();
  assert(current.state.status === DataState.SUCCESS, "6.2. B hoàn thành: State là SUCCESS");
  assert(current.state.data[0].id === "data-b", "6.3. UI hiển thị dữ liệu B");

  // A về sau
  await pA;
  current = renderView();
  assert(
    current.state.data[0].id === "data-b",
    "6.4. ĐẮP ỨNG CHỐNG RACE CONDITION: Khi cả A và B hoàn tất, UI vẫn giữ nguyên dữ liệu B!"
  );
  assert(current.state.status === DataState.SUCCESS, "6.5. State vẫn là SUCCESS của B");

  // -------------------------------------------------------------------
  // Tình huống 7: Lỗi của request cũ không được ghi đè SUCCESS của request mới
  // -------------------------------------------------------------------
  console.log("\n📌 Tình huống 7: Lỗi của request cũ không ghi đè SUCCESS mới");
  const pFailOld = current.loadData({
    delay: 120,
    shouldFail: true,
    errorMessage: "Lỗi muộn màng từ request cũ"
  });

  const pSuccessNew = current.loadData({
    delay: 30,
    shouldFail: false,
    data: [{ id: "data-c-winner", title: "Dữ liệu Request C chiến thắng", category: "Fresh", timestamp: "Mới" }]
  });

  await pSuccessNew;
  await pFailOld;

  current = renderView();
  assert(
    current.state.status === DataState.SUCCESS,
    "7.1. State vẫn là SUCCESS của request mới, không bị lỗi cũ biến thành ERROR"
  );
  assert(
    current.state.data[0].id === "data-c-winner",
    "7.2. Dữ liệu của request mới được bảo toàn 100%"
  );
  assert(current.state.error === null, "7.3. Error vẫn bằng null");

  console.log(`\n========================================================`);
  console.log(` KẾT QUẢ: ${passedAssertions}/${totalAssertions} ASSERTIONS ĐÃ ĐẠT (100% PASS)`);
  console.log(` CẢ 7 TÌNH HUỐNG KIỂM THỬ ĐỀU CHÍNH XÁC VÀ ĐẠT YÊU CẦU!`);
  console.log(`========================================================\n`);
}

run7Scenarios().catch((err) => {
  console.error("Test suite thất bại:", err);
  process.exit(1);
});
