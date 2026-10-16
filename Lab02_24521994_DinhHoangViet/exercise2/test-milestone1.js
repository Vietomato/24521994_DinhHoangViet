/**
 * Verification Test Suite for Milestone 1: stateStore and resetCursor engine
 */
import {
  createStateEngine,
  resetCursor,
  getCursor,
  allocateSlot,
  setSlotValue,
  getSlotValue,
  getStoreSnapshot,
  getSlotCount
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

console.log("=== BẮT ĐẦU KIỂM THỬ MILESTONE 1 ===");

// Test 1: Khởi tạo closure & cursor ban đầu
console.log("\nTest 1: Khởi tạo closure & cursor ban đầu");
assert(getCursor() === 0, "Cursor ban đầu phải bằng 0");
assert(getSlotCount() === 0, "Chưa cấp phát slot nào ban đầu");

// Test 2: Cấp phát nhiều slot tuần tự và kiểm tra tăng cursor
console.log("\nTest 2: Cấp phát slot tuần tự (bao gồm falsy values)");
const slot0 = allocateSlot("task 1");
const slot1 = allocateSlot(0); // falsy number
const slot2 = allocateSlot(false); // falsy boolean
const slot3 = allocateSlot(""); // falsy string
const slot4 = allocateSlot(null); // null
const slot5 = allocateSlot(undefined); // undefined

assert(slot0.index === 0 && slot0.value === "task 1", "Slot 0 khởi tạo đúng giá trị 'task 1'");
assert(slot1.index === 1 && slot1.value === 0, "Slot 1 khởi tạo đúng giá trị 0");
assert(slot2.index === 2 && slot2.value === false, "Slot 2 khởi tạo đúng giá trị false");
assert(slot3.index === 3 && slot3.value === "", "Slot 3 khởi tạo đúng giá trị ''");
assert(slot4.index === 4 && slot4.value === null, "Slot 4 khởi tạo đúng giá trị null");
assert(slot5.index === 5 && slot5.value === undefined, "Slot 5 khởi tạo đúng giá trị undefined");
assert(getCursor() === 6, "Cursor phải bằng 6 sau khi cấp phát 6 slot");
assert(getSlotCount() === 6, "Store phải có đúng 6 slot");

// Test 3: resetCursor() đưa cursor về 0 nhưng giữ nguyên state
console.log("\nTest 3: resetCursor() đưa cursor về 0 nhưng giữ nguyên state");
resetCursor();
assert(getCursor() === 0, "Cursor quay về 0 sau resetCursor()");
assert(getSlotCount() === 6, "Tổng số slot vẫn là 6, dữ liệu không bị xóa");

// Test 4: Mô phỏng re-render lượt 2 - gọi lại các slot với initialValue khác
console.log("\nTest 4: Mô phỏng render lượt 2 - không ghi đè giá trị đã có");
const r2_slot0 = allocateSlot("default other");
const r2_slot1 = allocateSlot(999);
const r2_slot2 = allocateSlot(true);
const r2_slot3 = allocateSlot("fallback text");
const r2_slot4 = allocateSlot("not null");
const r2_slot5 = allocateSlot("not undefined");

assert(r2_slot0.value === "task 1", "Slot 0 giữ nguyên 'task 1', không bị ghi đè bởi 'default other'");
assert(r2_slot1.value === 0, "Slot 1 giữ nguyên 0 (falsy), không bị ghi đè bởi 999");
assert(r2_slot2.value === false, "Slot 2 giữ nguyên false (falsy), không bị ghi đè bởi true");
assert(r2_slot3.value === "", "Slot 3 giữ nguyên '' (falsy), không bị ghi đè bởi fallback text");
assert(r2_slot4.value === null, "Slot 4 giữ nguyên null, không bị ghi đè");
assert(r2_slot5.value === undefined, "Slot 5 giữ nguyên undefined, không bị ghi đè");
assert(getCursor() === 6, "Cursor là 6 sau khi duyệt hết lượt render 2");

// Test 5: Cập nhật state qua setSlotValue và bảo toàn qua nhiều chu kỳ resetCursor
console.log("\nTest 5: Cập nhật state qua setSlotValue và reset qua nhiều chu kỳ");
setSlotValue(0, "task 1 updated");
setSlotValue(1, (prev) => prev + 10);
setSlotValue(2, true);

resetCursor();
assert(getCursor() === 0, "Cursor quay về 0 sau reset");

const r3_slot0 = allocateSlot("task 1 initial");
const r3_slot1 = allocateSlot(0);
const r3_slot2 = allocateSlot(false);

assert(r3_slot0.value === "task 1 updated", "Slot 0 bảo toàn giá trị mới cập nhật: 'task 1 updated'");
assert(r3_slot1.value === 10, "Slot 1 bảo toàn giá trị mới cập nhật qua updater: 10");
assert(r3_slot2.value === true, "Slot 2 bảo toàn giá trị mới cập nhật: true");

// Test 6: Kiểm tra tính độc lập của các engine instance thông qua factory
console.log("\nTest 6: Kiểm tra factory createStateEngine tạo môi trường cô lập");
const engineA = createStateEngine();
const engineB = createStateEngine();

engineA.allocateSlot("Engine A State");
engineB.allocateSlot("Engine B State");

assert(engineA.getSlotValue(0) === "Engine A State", "Engine A có state riêng biệt");
assert(engineB.getSlotValue(0) === "Engine B State", "Engine B có state riêng biệt");
engineA.resetCursor();
assert(engineA.getCursor() === 0, "Engine A reset cursor về 0");
assert(engineB.getCursor() === 1, "Engine B cursor vẫn là 1, không bị ảnh hưởng bởi Engine A");

console.log("\n=== KẾT QUẢ KIỂM THỬ ===");
console.log(`Đã vượt qua: ${testsPassed}/${testsPassed + testsFailed} assertions.`);
if (testsFailed === 0) {
  console.log(">> TẤT CẢ CÁC KIỂM THỬ MILESTONE 1 ĐÃ ĐẠT (PASSED) <<");
} else {
  console.error(">> CÓ LỖI XẢY RA TRONG KIỂM THỬ <<");
  process.exit(1);
}

