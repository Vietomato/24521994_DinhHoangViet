/**
 * Verification Test Suite for Milestone 2: reactive useState dispatcher
 *
 * Kiểm tra các tiêu chí trọng yếu:
 * 1. State tồn tại sau render lại.
 * 2. Cập nhật tasks không làm thay đổi filter (độc lập slot).
 * 3. Functional updater hoạt động (kể cả gọi liên tiếp nhận state mới nhất).
 * 4. Setter của lần render cũ vẫn cập nhật đúng slot đã capture.
 * 5. Falsy state (false, 0, "", null, undefined) được bảo toàn.
 * 6. Chính sách Object.is: không kích hoạt re-render thừa nếu giá trị không đổi.
 */

import {
  createStateEngine,
  useState,
  renderApp,
  resetCursor,
  getCursor,
  getRenderCount,
  getStoreSnapshot
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

console.log("=== BẮT ĐẦU KIỂM THỬ MILESTONE 2 ===");

// -----------------------------------------------------------------------------
// Test 1: State tồn tại sau render lại
// -----------------------------------------------------------------------------
console.log("\nTest 1: State tồn tại sau render lại");
{
  const engine = createStateEngine();
  let capturedState = null;
  let capturedSetter = null;

  function CounterComponent() {
    const [count, setCount] = engine.useState(10);
    capturedState = count;
    capturedSetter = setCount;
    return { type: "div", count };
  }

  // Render lượt 1: Giá trị ban đầu
  engine.renderApp(CounterComponent);
  assert(capturedState === 10, "Lượt 1: Giá trị ban đầu là 10");
  assert(engine.getRenderCount() === 1, "Render count sau lượt 1 là 1");

  // Kích hoạt setter -> tự động render lại
  capturedSetter(25);
  assert(capturedState === 25, "Lượt 2: State tồn tại và cập nhật lên 25 sau re-render");
  assert(engine.getRenderCount() === 2, "Render count sau khi gọi setter là 2");

  // Re-render thủ công: Không bị reset về 10
  engine.renderApp();
  assert(capturedState === 25, "Lượt 3: Re-render không bị reset về initialValue (vẫn là 25)");
  assert(engine.getRenderCount() === 3, "Render count sau re-render là 3");
}

// -----------------------------------------------------------------------------
// Test 2: Hai state tasks và filter hoạt động hoàn toàn độc lập
// -----------------------------------------------------------------------------
console.log("\nTest 2: Cập nhật tasks không làm thay đổi filter (độc lập giữa các slot)");
{
  const engine = createStateEngine();
  let currentTasks = null;
  let currentFilter = null;
  let setTasksFn = null;
  let setFilterFn = null;

  function TaskManager() {
    const [tasks, setTasks] = engine.useState(["Học JavaScript", "Làm bài tập Lab 2"]);
    const [filter, setFilter] = engine.useState("all");

    currentTasks = tasks;
    currentFilter = filter;
    setTasksFn = setTasks;
    setFilterFn = setFilter;

    return { tasks, filter };
  }

  engine.renderApp(TaskManager);
  assert(currentTasks.length === 2, "Ban đầu có 2 tasks");
  assert(currentFilter === "all", "Ban đầu filter là 'all'");
  assert(engine.getCursor() === 2, "Cursor là 2 sau khi gọi 2 useState");

  // Cập nhật tasks: Thêm task thứ 3
  setTasksFn([...currentTasks, "Review PR"]);
  assert(currentTasks.length === 3, "Tasks đã tăng lên 3 phần tử");
  assert(currentFilter === "all", "Filter vẫn giữ nguyên là 'all', không bị ảnh hưởng");

  // Cập nhật filter: Đổi sang 'completed'
  setFilterFn("completed");
  assert(currentFilter === "completed", "Filter cập nhật thành 'completed'");
  assert(currentTasks.length === 3, "Tasks vẫn giữ nguyên 3 phần tử, không bị ảnh hưởng");
}

// -----------------------------------------------------------------------------
// Test 3: Functional updater hoạt động & hai updater liên tiếp nhận state mới nhất
// -----------------------------------------------------------------------------
console.log("\nTest 3: Functional updater và hai updater liên tiếp");
{
  const engine = createStateEngine();
  let countValue = null;
  let setCountFn = null;

  function Counter() {
    const [count, setCount] = engine.useState(0);
    countValue = count;
    setCountFn = setCount;
    return count;
  }

  engine.renderApp(Counter);
  assert(countValue === 0, "Initial count = 0");

  // Gọi hai functional updater liên tiếp
  setCountFn((prev) => prev + 5);
  setCountFn((prev) => prev + 3);

  assert(countValue === 8, "Hai functional updater liên tiếp cập nhật chính xác (0 + 5 + 3 = 8)");
}

// -----------------------------------------------------------------------------
// Test 4: Setter của lần render cũ vẫn cập nhật đúng slot
// -----------------------------------------------------------------------------
console.log("\nTest 4: Setter của lần render cũ vẫn capture đúng slot");
{
  const engine = createStateEngine();
  let savedOldSetterSlot0 = null;
  let savedOldSetterSlot1 = null;
  let currentSlot0 = null;
  let currentSlot1 = null;

  function MultiSlotApp() {
    const [slot0Val, setSlot0] = engine.useState("A");
    const [slot1Val, setSlot1] = engine.useState("B");

    currentSlot0 = slot0Val;
    currentSlot1 = slot1Val;

    if (!savedOldSetterSlot0) {
      savedOldSetterSlot0 = setSlot0;
      savedOldSetterSlot1 = setSlot1;
    }
  }

  engine.renderApp(MultiSlotApp);
  assert(currentSlot0 === "A" && currentSlot1 === "B", "Khởi tạo ban đầu: A và B");

  // Gọi setter slot 1 bằng hàm mới để tạo chu kỳ render mới
  engine.renderApp();

  // Dùng old setter từ render 1 để cập nhật slot 0
  savedOldSetterSlot0("A_UPDATED_FROM_OLD_SETTER");
  assert(currentSlot0 === "A_UPDATED_FROM_OLD_SETTER", "Old setter slot 0 cập nhật chính xác vào slot 0");
  assert(currentSlot1 === "B", "Slot 1 không bị ảnh hưởng bởi old setter slot 0");

  // Dùng old setter từ render 1 để cập nhật slot 1
  savedOldSetterSlot1("B_UPDATED_FROM_OLD_SETTER");
  assert(currentSlot1 === "B_UPDATED_FROM_OLD_SETTER", "Old setter slot 1 cập nhật chính xác vào slot 1");
  assert(currentSlot0 === "A_UPDATED_FROM_OLD_SETTER", "Slot 0 không bị ảnh hưởng bởi old setter slot 1");
}

// -----------------------------------------------------------------------------
// Test 5: Falsy values (false, 0, "", null, undefined) được bảo toàn
// -----------------------------------------------------------------------------
console.log("\nTest 5: Bảo toàn các giá trị falsy qua re-render");
{
  const engine = createStateEngine();
  let vFalse, vZero, vEmpty, vNull, vUndef;
  let setFalse, setZero;

  function FalsyApp() {
    const [b, sb] = engine.useState(false);
    const [z, sz] = engine.useState(0);
    const [e] = engine.useState("");
    const [n] = engine.useState(null);
    const [u] = engine.useState(undefined);

    vFalse = b;
    vZero = z;
    vEmpty = e;
    vNull = n;
    vUndef = u;
    setFalse = sb;
    setZero = sz;
  }

  engine.renderApp(FalsyApp);
  assert(vFalse === false, "false được giữ nguyên");
  assert(vZero === 0, "0 được giữ nguyên");
  assert(vEmpty === "", "'' được giữ nguyên");
  assert(vNull === null, "null được giữ nguyên");
  assert(vUndef === undefined, "undefined được giữ nguyên");

  // Re-render nhiều lần không làm biến mất falsy value
  engine.renderApp();
  assert(vFalse === false && vZero === 0 && vEmpty === "", "Falsy values giữ nguyên qua re-render");
}

// -----------------------------------------------------------------------------
// Test 6: Chính sách Object.is - Bỏ qua re-render khi giá trị không thay đổi
// -----------------------------------------------------------------------------
console.log("\nTest 6: Chính sách Object.is bỏ qua render khi giá trị không đổi");
{
  const engine = createStateEngine();
  let setValFn = null;

  function App() {
    const [val, setVal] = engine.useState("unchanged");
    setValFn = setVal;
    return val;
  }

  engine.renderApp(App);
  const countBefore = engine.getRenderCount();
  assert(countBefore === 1, "Render count = 1 ban đầu");

  // Cập nhật giá trị y hệt giá trị hiện tại
  setValFn("unchanged");
  const countAfter = engine.getRenderCount();
  assert(countAfter === countBefore, "Không trigger render mới khi giá trị không đổi theo Object.is");

  // Cập nhật giá trị thực sự khác
  setValFn("changed");
  assert(engine.getRenderCount() === countBefore + 1, "Trigger render mới khi giá trị thay đổi");
}

// -----------------------------------------------------------------------------
// Test 7: Export trực tiếp useState và renderApp từ reactive-engine.js
// -----------------------------------------------------------------------------
console.log("\nTest 7: Kiểm tra instance mặc định xuất trực tiếp useState & renderApp");
{
  let exportedCount = null;
  let exportedSetCount = null;

  function DefaultApp() {
    const [c, sc] = useState(100);
    exportedCount = c;
    exportedSetCount = sc;
    return c;
  }

  renderApp(DefaultApp);
  assert(exportedCount === 100, "useState mặc định hoạt động với initialValue 100");

  exportedSetCount(200);
  assert(exportedCount === 200, "renderApp mặc định tự động re-render và cập nhật lên 200");
}

console.log("\n=== KẾT QUẢ KIỂM THỬ ===");
console.log(`Đã vượt qua: ${testsPassed}/${testsPassed + testsFailed} assertions.`);
if (testsFailed === 0) {
  console.log(">> TẤT CẢ CÁC KIỂM THỬ MILESTONE 2 ĐÃ ĐẠT (PASSED) <<");
} else {
  console.error(">> CÓ LỖI XẢY RA TRONG KIỂM THỬ <<");
  process.exit(1);
}

