# Resilient State Machine & Skeleton Loader — Rules (Exercise 3)

Tài liệu này kế thừa toàn bộ nền tảng kiến trúc từ **Exercise 2 (Reactive State Machine & Delegation Hub)** và bổ sung các quy tắc kỹ thuật nghiêm ngặt dành riêng cho **Exercise 3**.

---

## 1. Phạm Vi & Quy Chuẩn Kế Thừa Từ Exercise 2

- **Nền tảng JavaScript thuần**: Tiếp tục sử dụng 100% JavaScript ES Modules thuần (Vanilla JS). Tận dụng module VNode từ `mini-react.js` (Ex1) và State/Delegation Engine từ `reactive-engine.js` (Ex2).
- **Luồng dữ liệu một chiều**: Luôn tuân thủ chu trình khép kín:
  $$\text{User Event} \longrightarrow \text{Setter} \longrightarrow \text{State Update} \longrightarrow \text{Render} \longrightarrow \text{UI}$$
- **State Store trong Closure**: `stateStore` và con trỏ `cursor` được bảo toàn an toàn trong closure; `resetCursor()` đưa con trỏ về 0 trước mỗi lượt render mà không làm mất state đã lưu.
- **Root Event Delegation Hub**: Đăng ký sự kiện tập trung duy nhất tại phần tử gốc (`#app`), không gắn `addEventListener` hay inline handler rời rạc lên các phần tử con. Quản lý ánh xạ handlers qua `WeakMap` để chống rò rỉ bộ nhớ.
- **Không dùng React/Thư viện ngoài**: Không sử dụng React, Preact, Redux, TanStack Query hay bất kỳ thư viện Virtual DOM/State nào khác.
- **Tiêu chuẩn ngôn ngữ**: Dự án là JavaScript chuẩn. Sử dụng object tương đương (`Object.freeze`) và chú thích JSDoc (`@typedef`, `@param`, `@returns`) để mô tả kiểu dữ liệu; **tuyệt đối không chuyển đổi dự án sang TypeScript**.

---

## 2. Quy Tắc Riêng Cho Exercise 3 (Resilient Component Architecture)

### 2.1. Hợp Đồng Máy Trạng Thái Bền Vững (4-State Machine Contract)
- Thành phần cốt lõi: Xây dựng component `DataFeed` xử lý nạp dữ liệu bất đồng bộ (async data fetching).
- **Chỉ có đúng 4 trạng thái độc quyền (Mutually Exclusive States)**:
  ```javascript
  /**
   * @readonly
   * @enum {string}
   */
  export const DataState = Object.freeze({
    IDLE: "IDLE",       // Trạng thái ban đầu, chờ kích hoạt
    LOADING: "LOADING", // Đang tải dữ liệu bất đồng bộ
    SUCCESS: "SUCCESS", // Tải dữ liệu thành công
    ERROR: "ERROR"      // Gặp sự cố kết nối hoặc lỗi máy chủ
  });
  ```
- **Ràng buộc trạng thái**:
  - Không sử dụng các biến cờ boolean phân tán (như `isLoading && isError`) dễ gây ra trạng thái mâu thuẫn hoặc không xác định.
  - Mọi thời điểm, component chỉ thuộc duy nhất một trong bốn trạng thái trên.
  - Cấu trúc state chuẩn:
    ```javascript
    /**
     * @typedef {Object} FeedState
     * @property {string} status - Trạng thái hiện tại thuộc DataState
     * @property {Array|null} data - Danh sách dữ liệu (khi SUCCESS)
     * @property {string|null} error - Thông điệp lỗi chi tiết (khi ERROR)
     */
    ```

---

### 2.2. Hợp Đồng Giao Diện 4 Trạng Thái (1:1 UI Mapping)

Giao diện hiển thị phải luôn phản ánh chính xác 1:1 với trạng thái hiện tại của state machine:

1. **Trạng thái `IDLE` (Khởi đầu)**:
   - Hiển thị thông điệp hướng dẫn rõ ràng, thân thiện cho người dùng.
   - Cung cấp nút bấm hành động (CTA Button) mời gọi người dùng bắt đầu tải dữ liệu (ví dụ: *"Chưa có dữ liệu. Nhấn nút bên dưới để tải dữ liệu mới nhất"* $\rightarrow$ Nút *"Tải Dữ Liệu"*).
2. **Trạng thái `LOADING` (Khung xương chuyển động)**:
   - Thay thế toàn bộ nội dung bằng các khối **Skeleton Loader**.
   - Bắt buộc áp dụng hiệu ứng chuyển động CSS dạng **pulse** (`@keyframes pulse` hoặc shimmer gradient) tạo cảm giác ứng dụng đang xử lý mượt mà.
   - **Quy tắc Zero CLS (Cumulative Layout Shift = 0)**: Kích thước và bố cục của các thẻ skeleton phải khớp chính xác với kích thước của thẻ dữ liệu thật khi tải xong, ngăn chặn hiện tượng nhảy layout khi chuyển sang `SUCCESS`.
3. **Trạng thái `SUCCESS` (Dữ liệu thực tế)**:
   - Hiển thị danh sách dữ liệu tải về thành công.
   - Sử dụng các thẻ ngữ nghĩa HTML5 chuẩn (`<article>`, `<header>`, `<h3>`, `<p>`, `<span>`).
   - Mọi nội dung text truyền vào VNode phải được bảo vệ chống XSS thông qua `document.createTextNode()`.
4. **Trạng thái `ERROR` (Khắc phục lỗi)**:
   - Hiển thị thông báo sự cố rõ ràng, dễ hiểu (không hiển thị mã lỗi kỹ thuật khó hiểu cho người dùng).
   - Bắt buộc cung cấp nút bấm **"Retry Connection"** (Thử lại kết nối).
   - Khi bấm **"Retry Connection"**, hệ thống chuyển ngay sang trạng thái `LOADING` và gửi request mới.

---

### 2.3. Hợp Đồng Chống Race Condition (Race Condition Immunity Contract)

Trong môi trường bất đồng bộ, khi người dùng bấm tải lại liên tục hoặc mạng trễ không đồng đều, các phản hồi mạng (network responses) có thể về không theo đúng thứ tự gửi:
- **Nguyên tắc vàng**: **Request cũ tuyệt đối không được phép ghi đè lên kết quả của request mới hơn** (Out-of-order response resolution).
- **Cơ chế triển khai**:
  - Quản lý một biến đếm tăng dần `requestIdCounter` (hoặc token định danh) cho từng lượt yêu cầu.
  - Khi bắt đầu một request mới:
    $$\text{activeRequestId} = ++\text{requestIdCounter}$$
  - Khi một promise hoàn tất (`resolve` hoặc `reject`):
    - So sánh ID của request vừa hoàn tất với `activeRequestId`.
    - **Nếu trùng khớp**: Cho phép dispatch cập nhật state (`SUCCESS` hoặc `ERROR`).
    - **Nếu không trùng khớp (request đã cũ)**: Hủy bỏ kết quả, ghi log cảnh báo và giữ nguyên trạng thái của request mới hơn.

---

## 3. Quy Trình Kiểm Thử, Ghi Log & Cam Kết Git

- **Kiểm tra thực tế**: Mọi khẳng định hoàn thành phải dựa trên việc thực thi test runner tự động hoặc thao tác trực tiếp trên trình duyệt DevTools. Chưa chạy kiểm tra thì ghi rõ `Not run`, tuyệt đối không tự ý ghi `Passed`.
- **Nhật ký Prompt**: Ghi chép nguyên văn prompt và diễn biến triển khai vào `prompt-log.md` sau mỗi yêu cầu.
- **Nguyên tắc Git**: Không tự ý `git commit` khi chưa có yêu cầu từ người dùng.

