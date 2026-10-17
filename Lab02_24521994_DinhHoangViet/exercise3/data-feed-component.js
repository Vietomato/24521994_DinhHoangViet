/**
 * DataFeed Component & 4-State VNode Templates
 * Exercise 3: Resilient State Machine & Skeleton Loader
 */

import { createElement } from "../exercise1/mini-react.js";
import { DataState } from "./data-feed-logic.js";

/**
 * Thanh điều hướng liên kết giữa các bài tập trong Lab 02.
 * Giúp người dùng dễ dàng chuyển đổi giữa Exercise 1, 2 và 3.
 */
function renderNavigation() {
  return createElement(
    "nav",
    { className: "lab-nav", "aria-label": "Điều hướng bài tập" },
    createElement("a", { href: "../exercise1/index.html", className: "nav-link" }, "⬅ Bài 1: Mini-React Engine"),
    createElement("a", { href: "../exercise2/index.html", className: "nav-link" }, "⬅ Bài 2: Reactive State Hub"),
    createElement("span", { className: "nav-link active", "aria-current": "page" }, "📌 Bài 3: Resilient Component")
  );
}

/**
 * Tạo VNode hiển thị huy hiệu trạng thái hiện tại (Status Badge).
 * @param {string} status
 */
function renderStatusBadge(status) {
  let badgeClass = "badge-idle";
  let label = "IDLE (Chờ kích hoạt)";

  if (status === DataState.LOADING) {
    badgeClass = "badge-loading";
    label = "LOADING (Đang tải...)";
  } else if (status === DataState.SUCCESS) {
    badgeClass = "badge-success";
    label = "SUCCESS (Thành công)";
  } else if (status === DataState.ERROR) {
    badgeClass = "badge-error";
    label = "ERROR (Gặp sự cố)";
  }

  return createElement("span", { className: `status-badge ${badgeClass}` }, label);
}

/**
 * 1. Template giao diện trạng thái IDLE
 * - Hiển thị lời nhắc thân thiện.
 * - Nút bấm "Load Data".
 */
function renderIdleView({ onLoad }) {
  return createElement(
    "section",
    { className: "state-card state-idle" },
    createElement("span", { className: "state-icon", "aria-hidden": "true" }, "📥"),
    createElement("h2", null, "Chưa Có Dữ Liệu"),
    createElement(
      "p",
      null,
      "Hệ thống đang ở trạng thái nghỉ (IDLE). Vui lòng nhấn nút bên dưới để bắt đầu nạp danh sách dữ liệu mới nhất từ máy chủ."
    ),
    createElement(
      "button",
      {
        type: "button",
        className: "btn btn-primary btn-load",
        onClick: onLoad
      },
      "Load Data"
    )
  );
}

/**
 * 2. Template giao diện trạng thái LOADING
 * - Hiển thị 4 skeleton card có animation CSS dạng pulse.
 * - Bố cục khớp 1:1 với card dữ liệu thật (Zero CLS).
 * - Có thuộc tính aria-busy="true" và thông báo trợ năng.
 */
function renderLoadingView() {
  // Tạo đúng 4 skeleton card theo yêu cầu
  const skeletonCards = [1, 2, 3, 4].map((id) =>
    createElement(
      "article",
      { className: "skeleton-card pulse", "aria-hidden": "true", key: id },
      createElement(
        "div",
        { className: "skeleton-header" },
        createElement("div", { className: "skeleton-line skeleton-title pulse" }),
        createElement("div", { className: "skeleton-line skeleton-badge pulse" })
      ),
      createElement("div", { className: "skeleton-line skeleton-meta pulse" })
    )
  );

  return createElement(
    "section",
    {
      className: "state-card state-loading",
      role: "status",
      "aria-live": "polite",
      "aria-busy": "true"
    },
    createElement(
      "div",
      { className: "state-loading-header" },
      createElement("h2", null, "⏳ Đang tải dữ liệu... Vui lòng chờ trong giây lát"),
      createElement("span", { className: "loading-indicator pulse" }, "Đang kết nối API...")
    ),
    createElement("div", { className: "skeleton-list" }, ...skeletonCards)
  );
}

/**
 * 3. Template giao diện trạng thái SUCCESS
 * - Hiển thị dữ liệu mock thành các card rõ ràng, dễ đọc.
 * - Có nút tải lại (Reload).
 */
function renderSuccessView({ data, onLoad }) {
  const items = Array.isArray(data) ? data : [];

  const itemCards = items.map((item) =>
    createElement(
      "article",
      { className: "feed-item-card", key: item.id },
      createElement(
        "div",
        { className: "feed-item-header" },
        createElement("h3", null, item.title),
        createElement("span", { className: "item-category" }, item.category)
      ),
      createElement("p", { className: "item-timestamp" }, `Cập nhật: ${item.timestamp}`)
    )
  );

  return createElement(
    "section",
    { className: "state-card state-success" },
    createElement(
      "div",
      { className: "state-success-header" },
      createElement("h2", null, "✅ Dữ Liệu Đã Nạp Thành Công"),
      createElement(
        "button",
        {
          type: "button",
          className: "btn btn-secondary btn-reload",
          onClick: onLoad
        },
        "🔄 Tải lại"
      )
    ),
    createElement("div", { className: "feed-list" }, ...itemCards)
  );
}

/**
 * 4. Template giao diện trạng thái ERROR
 * - Hiển thị thông báo sự cố dễ hiểu, role="alert", aria-live="assertive".
 * - Nút "Retry Connection" gọi lại cùng luồng tải dữ liệu.
 */
function renderErrorView({ error, onRetry }) {
  return createElement(
    "section",
    {
      className: "state-card state-error",
      role: "alert",
      "aria-live": "assertive"
    },
    createElement("span", { className: "error-icon", "aria-hidden": "true" }, "⚠️"),
    createElement("h2", null, "Kết Nối Không Thành Công"),
    createElement(
      "p",
      { className: "error-banner" },
      error || "Đã xảy ra sự cố kết nối. Vui lòng thử lại."
    ),
    createElement(
      "button",
      {
        type: "button",
        className: "btn btn-danger btn-retry",
        onClick: onRetry
      },
      "Retry Connection"
    )
  );
}

/**
 * Component chính DataFeedApp kết hợp điều hướng, thanh điều khiển demo và khu vực hiển thị trạng thái.
 *
 * @param {Object} props
 * @param {import("./data-feed-logic.js").FeedState} props.state - Trạng thái của máy
 * @param {boolean} props.shouldFailMode - Chế độ mô phỏng lỗi
 * @param {Function} props.onToggleFailMode - Đổi chế độ thành công/thất bại
 * @param {Function} props.onLoad - Bắt đầu tải dữ liệu
 * @param {Function} props.onRetry - Thử lại kết nối
 * @param {Function} props.onRaceTest - Thử nghiệm race condition
 */
export function createDataFeedVNode({
  state,
  shouldFailMode,
  onToggleFailMode,
  onLoad,
  onRetry,
  onRaceTest
}) {
  // Chỉ render nội dung tương ứng đúng trạng thái hiện tại (1:1 mapping)
  let stateView = null;
  if (state.status === DataState.IDLE) {
    stateView = renderIdleView({ onLoad });
  } else if (state.status === DataState.LOADING) {
    stateView = renderLoadingView();
  } else if (state.status === DataState.SUCCESS) {
    stateView = renderSuccessView({ data: state.data, onLoad });
  } else if (state.status === DataState.ERROR) {
    stateView = renderErrorView({ error: state.error, onRetry });
  }

  return createElement(
    "main",
    { className: "feed-container" },

    // Thanh điều hướng liên kết các bài tập
    renderNavigation(),

    // Header ứng dụng
    createElement(
      "header",
      { className: "app-header" },
      createElement(
        "div",
        { className: "header-top" },
        createElement(
          "div",
          null,
          createElement("h1", null, "DataFeed Resilient Component"),
          createElement(
            "p",
            { className: "subtitle" },
            "Máy trạng thái 4 bước (IDLE, LOADING, SUCCESS, ERROR) & Skeleton Loader (Zero CLS)"
          )
        ),
        renderStatusBadge(state.status)
      ),

      // Khu vực demo nhỏ để chọn chế độ request (Thành công / Thất bại)
      createElement(
        "div",
        { className: "controls-card" },
        createElement(
          "div",
          { className: "control-row" },
          createElement("span", { className: "control-label" }, "Khu vực demo chọn kịch bản:"),
          createElement(
            "div",
            { className: "btn-group", role: "group", "aria-label": "Chọn chế độ request" },
            createElement(
              "button",
              {
                type: "button",
                className: `btn btn-mode ${!shouldFailMode ? "active-success" : ""}`,
                onClick: () => onToggleFailMode(false)
              },
              "✔ Request thành công"
            ),
            createElement(
              "button",
              {
                type: "button",
                className: `btn btn-mode ${shouldFailMode ? "active-error" : ""}`,
                onClick: () => onToggleFailMode(true)
              },
              "✖ Request thất bại"
            )
          )
        ),
        createElement(
          "div",
          { className: "control-row" },
          createElement("span", { className: "control-label" }, "Thao tác thử nghiệm:"),
          createElement(
            "div",
            { className: "btn-group" },
            createElement(
              "button",
              {
                type: "button",
                className: "btn btn-primary",
                onClick: onLoad
              },
              "Load Data"
            ),
            createElement(
              "button",
              {
                type: "button",
                className: "btn btn-secondary",
                onClick: onRaceTest
              },
              "⚡ Thử nghiệm Race Condition"
            )
          )
        ),
        createElement(
          "p",
          { className: "control-hint" },
          "💡 Mẹo: Khi ở trạng thái ERROR, bạn có thể chuyển chế độ sang 'Request thành công' ở trên rồi bấm 'Retry Connection' để quan sát phục hồi!"
        )
      )
    ),

    // Khung hiển thị nội dung theo đúng 1 trạng thái hiện tại
    stateView,

    // Footer
    createElement(
      "footer",
      { className: "app-footer" },
      createElement("p", null, "Đinh Hoàng Việt - 24521994 | Lab 02 - Exercise 3: Resilient State Machine")
    )
  );
}
