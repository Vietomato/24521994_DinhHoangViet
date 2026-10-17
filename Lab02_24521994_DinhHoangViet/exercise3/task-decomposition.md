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
|   - Tăng requestIdCounter: activeId = ++counter                         |
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
  - Định nghĩa bảng chuyển dịch trạng thái (State Transition Table) hợp lệ, nghiêm cấm các trạng thái lai.
- **Checklist**:
  - [ ] Khởi tạo enum `DataState` chuẩn và export trong module.
  - [ ] Viết JSDoc typedef cho `FeedState` và `FeedItem`.
  - [ ] Xây dựng hàm tạo state ban đầu `createInitialFeedState()`.
  - [ ] Viết hàm reducer/transition kiểm soát sự hợp lệ của quá trình đổi state.
- **Tiêu chí nghiệm thu**: State luôn thuộc duy nhất một trong bốn trạng thái; không có cờ boolean phân tán.
- **Kiểm tra**: **Not run**.
- **Commit message dự kiến**: `feat(state): define resilient 4-state machine contracts`

---

### Milestone 2 — Tải Dữ liệu Bất đồng bộ & Cơ chế Chống Race Condition
- **Mã Task**: `T-03B`
- **Tiêu đề**: `Async Data Fetcher & Sequence-based Race Condition Guard`
- **Mục tiêu**:
  - Xây dựng service tải dữ liệu bất đồng bộ giả lập độ trễ mạng và tỷ lệ lỗi ngẫu nhiên.
  - Triển khai cơ chế định danh `requestIdCounter` để nhận diện và loại bỏ hoàn toàn các response cũ về sau request mới.
- **Checklist**:
  - [ ] Xây dựng `fetchDataFeed(options)` trả về Promise với dữ liệu mẫu.
  - [ ] Tích hợp cơ chế token/sequence ID cho từng lượt gọi.
  - [ ] Viết hook/hàm điều phối kết nối với `useState`:
    - Khi bắt đầu gọi: Đổi state sang `LOADING`, tăng `activeRequestId`.
    - Khi hoàn tất thành công: So sánh `requestId`, nếu trùng thì chuyển sang `SUCCESS` kèm dữ liệu; nếu cũ thì hủy bỏ.
    - Khi phát sinh lỗi: So sánh `requestId`, nếu trùng thì chuyển sang `ERROR` kèm thông điệp; nếu cũ thì hủy bỏ.
- **Tiêu chí nghiệm thu**: Khi phát nhiều request liên tiếp với độ trễ lệch nhau, kết quả cuối cùng trên giao diện luôn thuộc về request gửi gần nhất.
- **Kiểm tra**: **Not run**.
- **Commit message dự kiến**: `feat(async): implement race condition immune data fetcher`

---

### Milestone 3 — Giao diện 4 Trạng thái & CSS Pulse Skeleton Loader
- **Mã Task**: `T-03C`
- **Tiêu đề**: `4-State UI Rendering & Zero-CLS Pulse Skeleton Animation`
- **Mục tiêu**:
  - Xây dựng component `DataFeed` render giao diện tương ứng với state hiện tại.
  - Thiết kế CSS Skeleton Loader với animation `@keyframes pulse`.
- **Checklist**:
  - [ ] Viết VNode template cho trạng thái `IDLE`: Text hướng dẫn + Button "Tải Dữ Liệu".
  - [ ] Viết VNode template và CSS cho trạng thái `LOADING`: Các khối skeleton mô phỏng thẻ dữ liệu, áp dụng animation pulse mượt mà, chiều cao cố định để đạt Zero CLS.
  - [ ] Viết VNode template cho trạng thái `SUCCESS`: Hiển thị danh sách card dữ liệu bằng thẻ ngữ nghĩa (`<article>`, `<header>`, `<h3>`, `<p>`).
  - [ ] Viết VNode template cho trạng thái `ERROR`: Hộp thông báo lỗi màu đỏ trực quan + Nút "Retry Connection".
  - [ ] Tích hợp Root Event Delegation tại `#app` để bắt sự kiện click nút Tải dữ liệu và Retry Connection.
- **Tiêu chí nghiệm thu**: Giao diện biến chuyển mượt mà giữa 4 trạng thái; nút Retry bấm được và kích hoạt lại luồng tải.
- **Kiểm tra**: **Not run**.
- **Commit message dự kiến**: `feat(ui): implement 4-state data feed with pulse skeleton`

---

### Milestone 4 — Kiểm thử Tự động, Thanh tra DevTools & Minh chứng
- **Mã Task**: `T-03D`
- **Tiêu đề**: `Automated Test Suite & DevTools Inspection Audit`
- **Mục tiêu**:
  - Xây dựng bộ test runner độc lập với các assertion kiểm chứng logic State Machine và Race Condition.
  - Chuẩn bị trang demo trực quan phục vụ thanh tra bằng DevTools và chụp 4 ảnh minh chứng.
- **Checklist**:
  - [ ] Viết test tự động: Chuyển dịch 4 trạng thái đúng quy tắc.
  - [ ] Viết test tự động mô phỏng Race Condition: Request 1 (trễ 300ms) bị Request 2 (trễ 50ms) ghi đè thành công; kết quả request 1 bị loại bỏ.
  - [ ] Kiểm tra trên DevTools:
    - Chụp Ảnh 1: Trạng thái IDLE.
    - Chụp Ảnh 2: Trạng thái LOADING (Skeleton pulse).
    - Chụp Ảnh 3: Trạng thái SUCCESS (Dữ liệu thực tế).
    - Chụp Ảnh 4: Trạng thái ERROR & nút Retry.
  - [ ] Cập nhật toàn bộ `prompt-log.md` với kết quả kiểm tra thật.
- **Tiêu chí nghiệm thu**: Toàn bộ unit tests đạt 100% Pass; 4 ảnh minh chứng ghi lại đầy đủ 4 trạng thái trên trình duyệt.
- **Kiểm tra**: **Not run**.
- **Commit message dự kiến**: `test(resilience): verify 4-state machine and race condition guard`

