# Task Decomposition & Work Breakdown Structure (Exercise 3)

**Dự án:** Resilient State Machine & Skeleton Loader  
**Kế thừa:** VNode Factory (Ex1) và Reactive State Engine & Root Delegation Hub (Ex2)  
**Tiêu chuẩn kỹ thuật:** Thuần JavaScript ES Modules, JSDoc Types, 4-State Machine, Zero CLS Skeleton Loader.

---

## Tổng Quan Kiến Trúc Exercise 3

Exercise 3 mở rộng hệ thống bằng việc xây dựng component `DataFeed` xử lý dữ liệu bất đồng bộ với cơ chế tự phục hồi (resilience):

```
+-------------------------------------------------------------------------+
|                               DataFeed UI                               |
|        (Hiển thị 1 trong 4 giao diện tương ứng với State Machine)       |
+-------------------------------------------------------------------------+
       |                     |                     |               |
       v                     v                     v               v
  [1. IDLE]            [2. LOADING]          [3. SUCCESS]     [4. ERROR]
  - Hướng dẫn           - Skeleton Loader     - Live Cards     - Thông báo lỗi
  - Nút "Tải dữ liệu"   - Pulse Animation     - Safe text      - Nút "Retry"
       |                                                           |
       +-----------------------+   +-------------------------------+
                               |   |
                               v   v
+-------------------------------------------------------------------------+
|             Async Data Fetcher & Race Condition Guard                   |
|   - Tăng requestIdCounter: currentId = ++counter                        |
|   - Bỏ qua các phản hồi trễ có requestId cũ (Drop Stale Responses)      |
+-------------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------------+
|             Reactive useState & Root Event Delegation Hub               |
|   - Dispatcher kích hoạt resetCursor() và re-render tự động             |
+-------------------------------------------------------------------------+
```

---

## Kế Hoạch Triển Khai 4 Milestone

### Milestone 1 — Thiết kế State Machine & Enum 4 Trạng thái
- **Mã Task**: `T-03A`
- **Tiêu đề**: `4-State Machine Modeling & JSDoc Type Definition`
- **Mục tiêu**: 
  - Khởi tạo object enum `DataState` đóng băng bằng `Object.freeze({ IDLE, LOADING, SUCCESS, ERROR })`.
  - Thiết kế cấu trúc state chuẩn chứa `{ status, data, error }`.
  - Định nghĩa bảng chuyển dịch trạng thái hợp lệ, nghiêm cấm các trạng thái lai.
- **Checklist**:
  - [x] Khởi tạo enum `DataState` chuẩn và export trong module `data-feed-logic.js`.
  - [x] Viết JSDoc typedef cho `FeedState` và `FeedItem`.
  - [x] Xây dựng hàm tạo state ban đầu `getInitialState()` (chỉ IDLE, data = null, error = null).
  - [x] Viết hàm điều phối kiểm soát tính toàn vẹn của state: chỉ SUCCESS có data, chỉ ERROR có error.
- **Tiêu chí nghiệm thu**: State luôn thuộc duy nhất một trong bốn trạng thái; không có cờ boolean phân tán; đã xác nhận qua unit tests.
- **Kiểm tra**: **Passed** (chạy `node test-data-feed-logic.js`, kiểm thử Test 1 và Test 3 đạt 100%).
- **Commit message dự kiến**: `feat(state): define resilient 4-state machine contracts`

---

### Milestone 2 — Tải Dữ liệu Bất đồng bộ & Cơ chế Chống Race Condition
- **Mã Task**: `T-03B`
- **Tiêu đề**: `Async Data Fetcher & Sequence-based Race Condition Guard`
- **Mục tiêu**:
  - Xây dựng service tải dữ liệu bất đồng bộ `mockFetchData` hỗ trợ timeout, chế độ lỗi và AbortSignal thật.
  - Triển khai cơ chế định danh `latestRequestId` tăng dần trong closure để loại bỏ hoàn toàn các response cũ về sau request mới.
- **Checklist**:
  - [x] Xây dựng `mockFetchData(options)` trả về Promise với dữ liệu mẫu, hỗ trợ cấu hình delay, shouldFail, và AbortSignal thật.
  - [x] Tích hợp cơ chế sequence ID `latestRequestId` tăng dần trong closure của `createDataFeedController`.
  - [x] Viết hook `useDataFeed` kết nối với custom `useState`:
    - Khi bắt đầu gọi: Đổi state sang `LOADING` (data = null, error = null), tăng `currentRequestId`.
    - Khi hoàn tất thành công: So sánh `currentRequestId === latestRequestId`, nếu trùng thì chuyển sang `SUCCESS` kèm dữ liệu; nếu cũ thì hủy bỏ.
    - Khi phát sinh lỗi: So sánh `currentRequestId === latestRequestId`, nếu trùng thì chuyển sang `ERROR` kèm thông điệp; nếu cũ thì hủy bỏ.
    - Hỗ trợ hàm `retry()` tái kích hoạt luồng tải an toàn.
- **Tiêu chí nghiệm thu**: Khi phát nhiều request liên tiếp với độ trễ lệch nhau, kết quả cuối cùng trên giao diện luôn thuộc về request gửi gần nhất; đã xác minh cả trường hợp lỗi và thành công.
- **Kiểm tra**: **Passed** (chạy `node test-data-feed-logic.js`, 41/41 assertions đạt).
- **Commit message dự kiến**: `feat(async): implement race condition immune data fetcher`

---

### Milestone 3 — Giao diện 4 Trạng thái & CSS Pulse Skeleton Loader
- **Mã Task**: `T-03C`
- **Tiêu đề**: `4-State UI Rendering & Zero-CLS Pulse Skeleton Animation`
- **Mục tiêu**:
  - Xây dựng component `DataFeed` render giao diện tương ứng với state hiện tại.
  - Thiết kế CSS Skeleton Loader với animation `@keyframes pulse`.
- **Checklist**:
  - [x] Viết VNode template cho trạng thái `IDLE`: Text hướng dẫn + Button "Load Data".
  - [x] Viết VNode template và CSS cho trạng thái `LOADING`: 4 khối skeleton mô phỏng thẻ dữ liệu, áp dụng animation pulse mượt mà, chiều cao cố định để đạt Zero CLS, kèm aria-busy="true".
  - [x] Viết VNode template cho trạng thái `SUCCESS`: Hiển thị danh sách card dữ liệu bằng thẻ ngữ nghĩa (`<article>`, `<header>`, `<h3>`, `<p>`) và nút tải lại.
  - [x] Viết VNode template cho trạng thái `ERROR`: Hộp thông báo lỗi màu đỏ trực quan (`role="alert"`) + Nút "Retry Connection".
  - [x] Hỗ trợ `@media (prefers-reduced-motion: reduce)` làm mờ animation pulse theo tiêu chuẩn trợ năng.
  - [x] Tích hợp Root Event Delegation tại `#app` (`ensureRootListener`) để bắt sự kiện click nút Tải dữ liệu, Đổi chế độ, Thử nghiệm Race Condition, và Retry Connection.
  - [x] Tạo thanh điều hướng liên kết (`.lab-nav`) cho phép truy cập qua lại giữa Exercise 1, Exercise 2 và Exercise 3.
- **Tiêu chí nghiệm thu**: Giao diện biến chuyển mượt mà giữa 4 trạng thái; chỉ render giao diện của trạng thái hiện tại; tương tác hoàn toàn qua root delegation.
- **Kiểm tra**: **Passed** (Kiểm tra tự động toàn diện qua `test-scenarios.js` đạt 38/38 assertions).
- **Commit message dự kiến**: `feat(ui): implement 4-state data feed with pulse skeleton`

---

### Milestone 4 — Kiểm thử Tự động, Thanh tra DevTools & Minh chứng
- **Mã Task**: `T-03D`
- **Tiêu đề**: `Automated Test Suite & DevTools Inspection Audit`
- **Mục tiêu**:
  - Xây dựng bộ test runner độc lập với các assertion kiểm chứng logic State Machine và Race Condition.
  - Chuẩn bị trang demo trực quan phục vụ thanh tra bằng DevTools và hướng dẫn kiểm tra 7 tình huống.
- **Checklist**:
  - [x] Viết test tự động: Chuyển dịch 4 trạng thái đúng quy tắc (đã đạt trong `test-data-feed-logic.js`, 41/41 assertions).
  - [x] Viết test tự động mô phỏng Race Condition: Request 1 (trễ 120ms) bị Request 2 (trễ 30ms) ghi đè thành công; kết quả request 1 bị loại bỏ.
  - [x] Viết test tự động cho cả 7 tình huống yêu cầu trong `test-scenarios.js` (38/38 assertions Passed):
    - Tình huống 1: Mở trang ban đầu -> IDLE.
    - Tình huống 2: Bấm Load Data -> LOADING & 4 Skeleton pulse cards.
    - Tình huống 3: Request thành công -> SUCCESS & Live Data.
    - Tình huống 4: Chọn chế độ thất bại rồi tải -> ERROR & nút Retry.
    - Tình huống 5: Chuyển sang thành công, bấm Retry Connection -> LOADING rồi SUCCESS.
    - Tình huống 6: Race condition (A chậm vs B nhanh) -> UI hiển thị dữ liệu B.
    - Tình huống 7: Lỗi của request cũ không ghi đè SUCCESS của request mới.
  - [ ] Kiểm tra trên DevTools và Live Server (sẵn sàng hướng dẫn người dùng chụp 4 ảnh minh chứng):
    - Chụp Ảnh 1: Trạng thái IDLE.
    - Chụp Ảnh 2: Trạng thái LOADING (Skeleton pulse).
    - Chụp Ảnh 3: Trạng thái SUCCESS (Dữ liệu thực tế).
    - Chụp Ảnh 4: Trạng thái ERROR & nút Retry.
  - [x] Cập nhật toàn bộ `prompt-log.md` với kết quả kiểm tra thật.
- **Tiêu chí nghiệm thu**: Toàn bộ unit tests đạt 100% Pass (79/79 assertions trên 2 file test); hướng dẫn thanh tra trực tiếp trên DevTools chi tiết, minh bạch.
- **Kiểm tra**: **Passed** (Test logic: 41/41, Test kịch bản 7 tình huống: 38/38).
- **Commit message dự kiến**: `test(resilience): verify 4-state machine and race condition guard`
