/**
 * Resilient State Machine & Skeleton Loader
 * Module: DataFeed Logic & Mock API Engine (Exercise 3)
 *
 * Chức năng:
 * - 4-State Machine: IDLE, LOADING, SUCCESS, ERROR (duy nhất, không dùng booleans phân tán).
 * - Mock API cục bộ có thể cấu hình delay, shouldFail, custom data và AbortSignal thật.
 * - Chống Race Condition bằng Request ID tăng dần bền vững qua các lần render.
 * - Tận dụng custom useState từ Exercise 2.
 */

import { useState as defaultUseState } from "../exercise2/reactive-engine.js";

/**
 * 4 Trạng thái duy nhất mô tả vòng đời tải dữ liệu của component DataFeed.
 * Đóng băng (Object.freeze) tương đương enum trong TypeScript.
 *
 * @readonly
 * @enum {string}
 */
export const DataState = Object.freeze({
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
});

/**
 * @typedef {Object} FeedItem
 * @property {string} id - Mã định danh mục dữ liệu
 * @property {string} title - Tiêu đề
 * @property {string} category - Danh mục
 * @property {string} timestamp - Thời gian đăng
 */

/**
 * @typedef {Object} FeedState
 * @property {string} status - Trạng thái hiện tại thuộc DataState
 * @property {Array<FeedItem> | any | null} data - Dữ liệu (chỉ có khi status === SUCCESS)
 * @property {string | null} error - Thông báo lỗi (chỉ có khi status === ERROR)
 */

/**
 * Dữ liệu mặc định mẫu phục vụ mock API.
 * @type {Array<FeedItem>}
 */
export const DEFAULT_MOCK_DATA = Object.freeze([
  { id: "item-1", title: "Cơ sở dữ liệu đám mây (Cloud Database Engine)", category: "Hệ thống", timestamp: "Vừa xong" },
  { id: "item-2", title: "Kiến trúc Microservices phản ứng bất đồng bộ", category: "Backend", timestamp: "5 phút trước" },
  { id: "item-3", title: "Giao diện thích ứng với Skeleton Loader Zero CLS", category: "Frontend", timestamp: "15 phút trước" },
  { id: "item-4", title: "Cơ chế Root Event Delegation và Quản lý Bộ nhớ WeakMap", category: "Hiệu năng", timestamp: "30 phút trước" }
]);

/**
 * @typedef {Object} MockApiOptions
 * @property {number} [delay=1500] - Độ trễ mạng giả lập (ms)
 * @property {boolean} [shouldFail=false] - Cờ quyết định giả lập lỗi kết nối
 * @property {any} [data=null] - Dữ liệu tùy chỉnh trả về khi thành công
 * @property {string} [errorMessage] - Thông báo lỗi khi thất bại
 * @property {AbortSignal} [signal] - AbortSignal hỗ trợ hủy bỏ request
 */

/**
 * Mock API cục bộ mô phỏng gọi mạng bất đồng bộ, ổn định, không cần internet.
 *
 * @param {MockApiOptions} [options={}]
 * @returns {Promise<any>}
 */
export function mockFetchData({
  delay = 1500,
  shouldFail = false,
  data = null,
  errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền và thử lại.",
  signal
} = {}) {
  return new Promise((resolve, reject) => {
    // 1. Kiểm tra nếu request đã bị hủy từ trước khi gửi
    if (signal?.aborted) {
      return reject(new DOMException("The operation was aborted.", "AbortError"));
    }

    let timerId = null;

    // 2. Lắng nghe sự kiện abort từ AbortSignal
    const onAbort = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      reject(new DOMException("The operation was aborted.", "AbortError"));
    };

    if (signal) {
      signal.addEventListener("abort", onAbort, { once: true });
    }

    // 3. Giả lập độ trễ mạng
    timerId = setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", onAbort);
      }
      if (shouldFail) {
        reject(new Error(errorMessage));
      } else {
        resolve(data !== null ? data : DEFAULT_MOCK_DATA);
      }
    }, delay);
  });
}

/**
 * Tạo controller quản lý State Machine và Race Condition cho DataFeed.
 * Request ID được đóng gói trong closure, đảm bảo bền vững qua các lần render.
 *
 * @param {Object} [config={}]
 * @param {Function} [config.useState] - Custom useState hook
 * @param {typeof mockFetchData} [config.fetcher] - Hàm fetch dữ liệu
 * @returns {Object}
 */
export function createDataFeedController({
  useState = defaultUseState,
  fetcher = mockFetchData
} = {}) {
  // Biến đếm request ID tăng dần tồn tại qua mọi vòng đời render
  let latestRequestId = 0;
  let activeAbortController = null;

  /**
   * Tạo trạng thái khởi tạo chuẩn cho DataFeed:
   * Chỉ IDLE, data = null, error = null.
   *
   * @returns {FeedState}
   */
  function getInitialState() {
    return {
      status: DataState.IDLE,
      data: null,
      error: null
    };
  }

  /**
   * Hook custom kết nối với state engine của component DataFeed.
   */
  function useDataFeed() {
    const [state, setState] = useState(getInitialState);

    /**
     * Bắt đầu tải dữ liệu bất đồng bộ với cơ chế chống Race Condition.
     *
     * @param {MockApiOptions} [options={}]
     * @returns {Promise<FeedState>} Trạng thái sau khi tải
     */
    const loadData = async (options = {}) => {
      // 1. Cấp phát Request ID mới tăng dần
      latestRequestId += 1;
      const currentRequestId = latestRequestId;

      // 2. Hủy bỏ request trước đó nếu vẫn còn đang xử lý dở dang
      if (activeAbortController) {
        activeAbortController.abort();
      }
      activeAbortController = new AbortController();
      const signal = activeAbortController.signal;

      // 3. Chuyển ngay sang trạng thái LOADING (chỉ LOADING, data = null, error = null)
      setState({
        status: DataState.LOADING,
        data: null,
        error: null
      });

      try {
        const result = await fetcher({
          ...options,
          signal
        });

        // 4. KIỂM TRA CHỐNG RACE CONDITION (Thành công):
        // Nếu đã có request mới hơn được kích hoạt, bỏ qua kết quả cũ
        if (currentRequestId !== latestRequestId) {
          return {
            status: DataState.LOADING,
            data: null,
            error: null,
            discarded: true
          };
        }

        // 5. Chuyển sang SUCCESS: Chỉ SUCCESS có data, error = null
        const successState = {
          status: DataState.SUCCESS,
          data: result,
          error: null
        };
        setState(successState);
        return successState;
      } catch (err) {
        // Nếu bị hủy do AbortSignal hoặc request đã cũ -> Bỏ qua kết quả lỗi này
        if (err.name === "AbortError" || currentRequestId !== latestRequestId) {
          return {
            status: DataState.LOADING,
            data: null,
            error: null,
            discarded: true
          };
        }

        // 6. Chuyển sang ERROR: Chỉ ERROR có error với thông điệp dễ hiểu, data = null
        const userFriendlyMessage = err instanceof Error
          ? err.message
          : "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền và thử lại.";

        const errorState = {
          status: DataState.ERROR,
          data: null,
          error: userFriendlyMessage
        };
        setState(errorState);
        return errorState;
      }
    };

    /**
     * Thử lại kết nối khi gặp lỗi (chuyển sang LOADING và fetch lại).
     *
     * @param {MockApiOptions} [options={}]
     * @returns {Promise<FeedState>}
     */
    const retry = (options = {}) => {
      return loadData(options);
    };

    return {
      state,
      loadData,
      retry,
      getLatestRequestId: () => latestRequestId
    };
  }

  return {
    useDataFeed,
    getLatestRequestId: () => latestRequestId,
    reset() {
      latestRequestId = 0;
      if (activeAbortController) {
        activeAbortController.abort();
        activeAbortController = null;
      }
    }
  };
}

