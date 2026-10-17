/**
 * Automated Unit Test Suite for Exercise 3 Logic
 * Tests: 4-State Machine, Mock API, Race Condition Immunity & Request ID Persistence
 */

import {
  DataState,
  DEFAULT_MOCK_DATA,
  mockFetchData,
  createDataFeedController
} from "./data-feed-logic.js";
import { createStateEngine } from "../exercise2/reactive-engine.js";

let totalAssertions = 0;
let passedAssertions = 0;

function assert(condition, message) {
  totalAssertions += 1;
  if (!condition) {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedAssertions += 1;
  console.log(`  [PASS] ${message}`);
}

async function runAllTests() {
  console.log("\n=== BẮT ĐẦU KIỂM THỬ EXERCISE 3 LOGIC & RACE CONDITION ===");

  // -------------------------------------------------------------------------
  // Test 1: Kiểm tra DataState Enum có đúng 4 trạng thái độc quyền
  // -------------------------------------------------------------------------
  console.log("\nTest 1: Kiểm tra DataState Enum");
  const stateKeys = Object.keys(DataState);
  assert(stateKeys.length === 4, "DataState phải có đúng 4 trạng thái");
  assert(DataState.IDLE === "IDLE", "DataState.IDLE phải có giá trị 'IDLE'");
  assert(DataState.LOADING === "LOADING", "DataState.LOADING phải có giá trị 'LOADING'");
  assert(DataState.SUCCESS === "SUCCESS", "DataState.SUCCESS phải có giá trị 'SUCCESS'");
  assert(DataState.ERROR === "ERROR", "DataState.ERROR phải có giá trị 'ERROR'");
  assert(Object.isFrozen(DataState), "DataState phải được đóng băng (Object.freeze)");

  // -------------------------------------------------------------------------
  // Test 2: Mock API hoạt động độc lập không cần mạng (Success & Failure & Signal)
  // -------------------------------------------------------------------------
  console.log("\nTest 2: Kiểm tra Mock API");
  const fastData = await mockFetchData({ delay: 10, shouldFail: false });
  assert(Array.isArray(fastData), "Mock API trả về mảng dữ liệu mặc định");
  assert(fastData.length === 4, "Dữ liệu mặc định có đúng 4 mục tương ứng 4 skeleton cards");

  let caughtError = null;
  try {
    await mockFetchData({ delay: 10, shouldFail: true, errorMessage: "Lỗi kết nối kiểm thử" });
  } catch (err) {
    caughtError = err;
  }
  assert(caughtError !== null, "Mock API chế độ shouldFail phải reject Error");
  assert(caughtError?.message === "Lỗi kết nối kiểm thử", "Mock API giữ đúng thông điệp lỗi");

  // Kiểm tra AbortSignal thật
  const abortCtrl = new AbortController();
  const abortPromise = mockFetchData({ delay: 100, signal: abortCtrl.signal });
  abortCtrl.abort();
  let caughtAbort = null;
  try {
    await abortPromise;
  } catch (err) {
    caughtAbort = err;
  }
  assert(caughtAbort?.name === "AbortError", "Mock API thực sự hỗ trợ AbortSignal và ném AbortError khi bị hủy");

  // -------------------------------------------------------------------------
  // Test 3: Vòng đời State Machine (IDLE -> LOADING -> SUCCESS)
  // -------------------------------------------------------------------------
  console.log("\nTest 3: Vòng đời tải dữ liệu thành công");
  const engine1 = createStateEngine();
  const controller1 = createDataFeedController({
    useState: engine1.useState,
    fetcher: mockFetchData
  });

  let hook1 = controller1.useDataFeed();
  // Trạng thái ban đầu IDLE: data = null, error = null
  assert(hook1.state.status === DataState.IDLE, "Trạng thái ban đầu phải là IDLE");
  assert(hook1.state.data === null, "Trạng thái IDLE: data phải bằng null");
  assert(hook1.state.error === null, "Trạng thái IDLE: error phải bằng null");

  // Kích hoạt loadData
  const loadPromise1 = hook1.loadData({ delay: 30, data: [{ id: "custom-1", title: "Test Item" }] });

  // Kiểm tra ngay lập tức: phải chuyển sang LOADING, data = null, error = null
  engine1.resetCursor();
  hook1 = controller1.useDataFeed();
  assert(hook1.state.status === DataState.LOADING, "Khi bắt đầu tải: phải chuyển ngay sang LOADING");
  assert(hook1.state.data === null, "Trạng thái LOADING: data phải bằng null");
  assert(hook1.state.error === null, "Trạng thái LOADING: error phải bằng null");

  // Đợi tải hoàn tất
  await loadPromise1;
  engine1.resetCursor();
  hook1 = controller1.useDataFeed();
  assert(hook1.state.status === DataState.SUCCESS, "Sau khi tải xong: phải chuyển sang SUCCESS");
  assert(Array.isArray(hook1.state.data) && hook1.state.data[0].id === "custom-1", "Chỉ SUCCESS có data thực tế");
  assert(hook1.state.error === null, "Trạng thái SUCCESS: error phải bằng null");

  // -------------------------------------------------------------------------
  // Test 4: Vòng đời State Machine (IDLE -> LOADING -> ERROR -> Retry)
  // -------------------------------------------------------------------------
  console.log("\nTest 4: Vòng đời tải dữ liệu thất bại và Retry");
  const engine2 = createStateEngine();
  const controller2 = createDataFeedController({
    useState: engine2.useState,
    fetcher: mockFetchData
  });

  let hook2 = controller2.useDataFeed();
  const failPromise = hook2.loadData({
    delay: 30,
    shouldFail: true,
    errorMessage: "Máy chủ tạm thời bận. Vui lòng thử lại sau."
  });

  engine2.resetCursor();
  hook2 = controller2.useDataFeed();
  assert(hook2.state.status === DataState.LOADING, "Bắt đầu tải lỗi: chuyển sang LOADING");

  await failPromise;
  engine2.resetCursor();
  hook2 = controller2.useDataFeed();
  assert(hook2.state.status === DataState.ERROR, "Sau khi lỗi: chuyển sang ERROR");
  assert(hook2.state.data === null, "Trạng thái ERROR: data phải bằng null");
  assert(hook2.state.error === "Máy chủ tạm thời bận. Vui lòng thử lại sau.", "Chỉ ERROR có error với thông điệp dễ hiểu");

  // Thử lại bằng retry()
  const retryPromise = hook2.retry({ delay: 20, shouldFail: false, data: [{ id: "retry-ok" }] });
  engine2.resetCursor();
  hook2 = controller2.useDataFeed();
  assert(hook2.state.status === DataState.LOADING, "Bấm Retry: chuyển ngay sang LOADING");

  await retryPromise;
  engine2.resetCursor();
  hook2 = controller2.useDataFeed();
  assert(hook2.state.status === DataState.SUCCESS, "Retry thành công: chuyển sang SUCCESS");
  assert(hook2.state.data[0].id === "retry-ok", "Data cập nhật sau retry thành công");
  assert(hook2.state.error === null, "Error xóa về null sau khi retry thành công");

  // -------------------------------------------------------------------------
  // Test 5: Chống Race Condition (Request cũ về sau KHÔNG ghi đè request mới)
  // -------------------------------------------------------------------------
  console.log("\nTest 5: Kiểm tra chống Race Condition (Out-of-order responses)");
  const engine3 = createStateEngine();
  const controller3 = createDataFeedController({
    useState: engine3.useState,
    fetcher: mockFetchData
  });

  let hook3 = controller3.useDataFeed();

  // Bắn Request 1 chậm (delay 120ms, trả về "Data Request 1")
  const req1Promise = hook3.loadData({
    delay: 120,
    data: [{ id: "req-1", title: "Dữ liệu cũ (Request 1)" }]
  });
  const req1Id = controller3.getLatestRequestId();
  assert(req1Id === 1, "Request 1 có Request ID = 1");

  // Ngay sau đó, bắn Request 2 nhanh hơn (delay 30ms, trả về "Data Request 2")
  const req2Promise = hook3.loadData({
    delay: 30,
    data: [{ id: "req-2", title: "Dữ liệu mới nhất (Request 2)" }]
  });
  const req2Id = controller3.getLatestRequestId();
  assert(req2Id === 2, "Request 2 có Request ID = 2 (tăng dần)");
  assert(req2Id > req1Id, "Request ID mới luôn lớn hơn Request ID cũ");

  // Đợi Request 2 hoàn thành trước
  await req2Promise;
  engine3.resetCursor();
  hook3 = controller3.useDataFeed();
  assert(hook3.state.status === DataState.SUCCESS, "Request 2 hoàn thành trước: State là SUCCESS");
  assert(hook3.state.data[0].id === "req-2", "State đang chứa dữ liệu của Request 2");

  // Đợi Request 1 chậm chạp về đích sau cùng
  await req1Promise;
  engine3.resetCursor();
  hook3 = controller3.useDataFeed();

  // ĐIỀU KIỆN CHỐNG RACE CONDITION QUYẾT ĐỊNH:
  assert(
    hook3.state.data[0].id === "req-2",
    "CHỐNG RACE CONDITION THÀNH CÔNG: Dữ liệu của Request 1 cũ KHÔNG ghi đè dữ liệu của Request 2 mới!"
  );
  assert(hook3.state.status === DataState.SUCCESS, "State vẫn giữ nguyên SUCCESS của Request 2");

  // -------------------------------------------------------------------------
  // Test 6: Chống Race Condition với lỗi (Lỗi của Request cũ không ghi đè SUCCESS mới)
  // -------------------------------------------------------------------------
  console.log("\nTest 6: Lỗi từ request cũ không làm hỏng state mới");
  const engine4 = createStateEngine();
  const controller4 = createDataFeedController({
    useState: engine4.useState,
    fetcher: mockFetchData
  });

  let hook4 = controller4.useDataFeed();

  // Request 1 chậm bị lỗi (delay 100ms)
  const reqFailSlow = hook4.loadData({
    delay: 100,
    shouldFail: true,
    errorMessage: "Lỗi từ request 1 cũ"
  });

  // Request 2 nhanh thành công (delay 25ms)
  const reqSuccessFast = hook4.loadData({
    delay: 25,
    shouldFail: false,
    data: [{ id: "fast-win", title: "Dữ liệu thành công mới" }]
  });

  await reqSuccessFast;
  await reqFailSlow;

  engine4.resetCursor();
  hook4 = controller4.useDataFeed();

  assert(hook4.state.status === DataState.SUCCESS, "Lỗi từ request cũ KHÔNG ghi đè SUCCESS của request mới");
  assert(hook4.state.data[0].id === "fast-win", "Dữ liệu mới được bảo toàn");
  assert(hook4.state.error === null, "Error vẫn là null, không bị lỗi cũ làm hỏng");

  // -------------------------------------------------------------------------
  // Test 7: Request ID bền vững qua nhiều chu kỳ render
  // -------------------------------------------------------------------------
  console.log("\nTest 7: Request ID bền vững qua nhiều chu kỳ render");
  const engine5 = createStateEngine();
  const controller5 = createDataFeedController({
    useState: engine5.useState,
    fetcher: mockFetchData
  });

  // Giả lập 5 lượt render liên tiếp
  for (let i = 0; i < 5; i++) {
    engine5.resetCursor();
    controller5.useDataFeed();
  }
  assert(controller5.getLatestRequestId() === 0, "Render thuần túy không làm tăng Request ID");

  const hook5 = controller5.useDataFeed();
  await hook5.loadData({ delay: 10 });
  assert(controller5.getLatestRequestId() === 1, "Sau 1 lượt gọi loadData, Request ID = 1");

  // Thêm 5 lượt render nữa
  for (let i = 0; i < 5; i++) {
    engine5.resetCursor();
    controller5.useDataFeed();
  }
  assert(controller5.getLatestRequestId() === 1, "Request ID được lưu trong closure, không bị khởi tạo lại khi render");

  console.log(`\n=== TỔNG KẾT: ĐÃ VƯỢT QUA ${passedAssertions}/${totalAssertions} ASSERTIONS (100% PASS) ===\n`);
}

runAllTests().catch((err) => {
  console.error("Test Suite gặp lỗi nghiêm trọng:", err);
  process.exit(1);
});

