/**
 * Reactive State Machine & Delegation Hub
 * Module: Reactive State Engine (Milestone 1)
 *
 * Chức năng cốt lõi:
 * - Đóng gói stateStore và cursor bên trong closure.
 * - Quản lý các slot lưu trữ state theo thứ tự ổn định.
 * - resetCursor() đưa con trỏ về 0 trước mỗi lượt render mà không làm mất dữ liệu state.
 * - Bảo toàn mọi kiểu giá trị bao gồm falsy (false, 0, "", null, undefined).
 */

/**
 * Factory tạo một phiên bản State Engine độc lập được bao bọc bởi closure.
 *
 * @returns {object} Interface điều khiển state store và cursor
 */
export function createStateEngine() {
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
   * Đưa con trỏ cursor về 0 trước mỗi lượt render mới.
   * Tuyệt đối không xóa hoặc làm rỗng stateStore.
   */
  function resetCursor() {
    cursor = 0;
  }

  /**
   * Lấy vị trí con trỏ hiện tại (phục vụ kiểm tra và theo dõi).
   * @returns {number}
   */
  function getCursor() {
    return cursor;
  }

  /**
   * Phân bổ hoặc lấy slot state tại vị trí cursor hiện tại, sau đó tăng cursor.
   * Nếu slot chưa từng được khởi tạo, lưu initialValue vào slot.
   * Nếu slot đã tồn tại, giữ nguyên giá trị hiện có (kể cả false, 0, "", null, undefined).
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
   * Đọc giá trị tại một slot cụ thể.
   *
   * @param {number} index - Chỉ số slot
   * @returns {any}
   */
  function getSlotValue(index) {
    if (index < 0 || index >= stateStore.length) {
      throw new RangeError(`[reactive-engine] Invalid slot index: ${index}`);
    }
    return stateStore[index];
  }

  /**
   * Lấy bản sao snapshot của stateStore (phục vụ kiểm thử, không can thiệp mảng gốc).
   * @returns {Array<any>}
   */
  function getStoreSnapshot() {
    return [...stateStore];
  }

  /**
   * Đếm tổng số slot đã được cấp phát.
   * @returns {number}
   */
  function getSlotCount() {
    return stateStore.length;
  }

  return {
    resetCursor,
    getCursor,
    allocateSlot,
    setSlotValue,
    getSlotValue,
    getStoreSnapshot,
    getSlotCount
  };
}

// Khởi tạo instance mặc định của engine cho ứng dụng
const defaultEngine = createStateEngine();

export const resetCursor = defaultEngine.resetCursor;
export const getCursor = defaultEngine.getCursor;
export const allocateSlot = defaultEngine.allocateSlot;
export const setSlotValue = defaultEngine.setSlotValue;
export const getSlotValue = defaultEngine.getSlotValue;
export const getStoreSnapshot = defaultEngine.getStoreSnapshot;
export const getSlotCount = defaultEngine.getSlotCount;

