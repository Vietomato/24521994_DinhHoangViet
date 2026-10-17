# Exercise 3: Resilient State Machine & Skeleton Loader

> **Môn học:** Thiết kế Giao diện Người dùng & Lập trình Web Hiện đại  
> **Sinh viên thực hiện:** Đinh Hoàng Việt  
> **MSSV:** 24521994  
> **Chuẩn công nghệ:** Thuần JavaScript ES Modules (Vanilla JS), 4-State Machine, Zero CLS Skeleton Loader, Sequence Counter Race Condition Guard.

---

## 📌 Tổng Quan Dự Án

Bài tập Exercise 3 mở rộng kiến trúc từ Exercise 1 (VNode Engine) và Exercise 2 (Reactive State Engine & Root Delegation Hub) để giải quyết trọn vẹn bài toán **tải dữ liệu bất đồng bộ có tính tự phục hồi (Resilient Data Feed)**:

1. **Finite State Machine 4 Trạng Thái**: Loại bỏ các biến cờ boolean phân tán (`isLoading`, `isError`, `isSuccess`). Vòng đời tải dữ liệu được quản lý bởi một enum duy nhất: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`. Chỉ `SUCCESS` chứa dữ liệu (`data`), chỉ `ERROR` chứa thông điệp lỗi (`error`).
2. **Miễn Nhiễm Race Condition (Sequence-based Guard)**: Sử dụng Request ID tăng dần được lưu trong closure để hủy bỏ kết quả của các request cũ (stale responses) về sau request mới, áp dụng nghiêm ngặt cho cả kết quả thành công lẫn lỗi.
3. **Zero CLS Skeleton Loader với Animation Pulse**: Giao diện trạng thái `LOADING` hiển thị đúng 4 skeleton card có kích thước khớp tuyệt đối với card dữ liệu thật, ngăn ngừa hiện tượng giật layout (Cumulative Layout Shift) và hỗ trợ chuẩn trợ năng `prefers-reduced-motion`.
4. **Cơ Chế Phục Hồi Thất Bại (Self-healing & Retry)**: Cung cấp nút "Retry Connection" gọi lại cùng một luồng tải an toàn, có khu vực demo chuyển đổi linh hoạt giữa chế độ thành công và thất bại.

---

## 🏗️ Kiến Trúc State Machine & Vòng Đời Bất Đồng Bộ

```
                   +------------------------+
                   |       1. IDLE          |
                   |  (data:null, err:null) |
                   +------------------------+
                               |
                               | loadData() / retry()
                               v
                   +------------------------+
                   |       2. LOADING       | <--------------------+
                   |  (data:null, err:null) |                      |
                   +------------------------+                      |
                     /                    \                        |
       fetch thành công                     fetch thất bại         |
     (currentId === latestId)             (currentId === latestId) |
                   /                        \                      |
                  v                          v                     |
      +------------------------+     +------------------------+    |
      |       3. SUCCESS       |     |       4. ERROR         |    |
      | (data: [...], err:null)|     | (data:null, err: "...")|    |
      +------------------------+     +------------------------+    |
                  |                              |                 |
                  | reload()                     | Retry           |
                  +------------------------------+-----------------+
```

---

## ⚙️ Các Thành Phần Kỹ Thuật Chính

### 1. `data-feed-logic.js`
- **Enum `DataState`**: Đóng băng qua `Object.freeze({ IDLE: "IDLE", LOADING: "LOADING", SUCCESS: "SUCCESS", ERROR: "ERROR" })`.
- **`mockFetchData(options)`**: Mock API bất đồng bộ cục bộ hỗ trợ `delay`, `shouldFail`, `errorMessage`, và lắng nghe `AbortSignal` thật.
- **`createDataFeedController({ useState, fetcher })`**: Quản lý `latestRequestId = 0` và `activeAbortController` bên trong closure:
  - Tăng `currentRequestId = ++latestRequestId` mỗi khi gọi `loadData()` hoặc `retry()`.
  - Hủy request đang dang dở qua `abort()`.
  - Khi Promise hoàn tất, chỉ cho phép cập nhật state nếu `currentRequestId === latestRequestId`.

### 2. `data-feed-component.js`
- **Root Event Delegation**: Tất cả thao tác người dùng (Load Data, Retry Connection, Reload, Toggle Mode, Race Test) đều dùng event delegation tập trung.
- **Giao diện 4 trạng thái độc quyền**:
  - `state-idle`: Hướng dẫn tương tác và nút "Load Data".
  - `state-loading`: Thuộc tính `aria-busy="true"`, `role="status"` và 4 khung skeleton card.
  - `state-success`: 4 thẻ bài viết ngữ nghĩa (`<article>`, `<header>`, `<h3>`, `<p>`, `<span>`) và nút tải lại.
  - `state-error`: Hộp thông báo màu đỏ trực quan với `role="alert"` và nút "Retry Connection".
- **Navigation Bar (`.lab-nav`)**: Cho phép chuyển hướng linh hoạt giữa Exercise 1, 2 và 3.

### 3. `style.css`
- Hiệu ứng `@keyframes pulse` thay đổi `opacity` nhịp nhàng từ 0.6 đến 1.0.
- Khớp kích thước tuyệt đối giữa thẻ Skeleton và Live Card giúp loại bỏ Cumulative Layout Shift (`CLS = 0`).
- Tuân thủ chuẩn W3C Accessibility: Hỗ trợ `@media (prefers-reduced-motion: reduce)`.

---

## 🧪 Kết Quả Kiểm Thử Tự Động (79/79 Assertions Passed)

Dự án đi kèm 2 bộ test runner độc lập chạy trên môi trường Node.js:

```powershell
# 1. Kiểm thử logic cốt lõi và Race Condition Guard
node Lab02_24521994_DinhHoangViet/exercise3/test-data-feed-logic.js

# 2. Kiểm thử kịch bản 7 tình huống giao diện và bất đồng bộ
node Lab02_24521994_DinhHoangViet/exercise3/test-scenarios.js
```

### Bảng Tổng Hợp 7 Tình Huống Kịch Bản (`test-scenarios.js`):
1. **Tình huống 1 (Mở trang - IDLE)**: State `IDLE`, `data = null`, `error = null`, hiển thị hướng dẫn và nút `Load Data` (**5/5 Pass**).
2. **Tình huống 2 (Bấm Load Data - LOADING)**: Chuyển ngay sang `LOADING`, `aria-busy="true"`, 4 skeleton cards có class `pulse` (**7/7 Pass**).
3. **Tình huống 3 (Request thành công - SUCCESS)**: State `SUCCESS`, hiển thị đủ 4 card dữ liệu thật, có nút `Reload` (**6/6 Pass**).
4. **Tình huống 4 (Chọn thất bại - ERROR)**: State `ERROR`, `role="alert"`, hiển thị thông điệp lỗi và nút `Retry Connection` (**8/8 Pass**).
5. **Tình huống 5 (Đổi sang thành công & Retry)**: `LOADING` chuyển sang `SUCCESS`, dữ liệu phục hồi (**4/4 Pass**).
6. **Tình huống 6 (Race condition - A chậm vs B nhanh)**: Request B về trước, Request A về sau bị bỏ qua, UI giữ nguyên dữ liệu B (**5/5 Pass**).
7. **Tình huống 7 (Lỗi request cũ không ghi đè SUCCESS mới)**: Lỗi từ request cũ về muộn bị hủy bỏ, bảo toàn state `SUCCESS` (**3/3 Pass**).

---

## 🚀 Hướng Dẫn Trải Nghiệm Bằng Live Server

1. Mở file [exercise3/index.html](./index.html) bằng **Live Server** trong VS Code.
2. Mở **DevTools (F12)** -> Tab **Console** để theo dõi log chi tiết:
   - Thử bấm **"Load Data"** và quan sát Skeleton Pulse chuyển thành dữ liệu.
   - Chọn **"Thất bại (503 Error)"** và bấm **"Load Data"** để quan sát hộp lỗi và nút Retry.
   - Chọn lại **"Thành công (200 OK)"** và bấm **"Retry Connection"** để kiểm tra tính tự phục hồi.
   - Bấm **"⚡ Thử nghiệm Race Condition"** để chứng kiến Request B đè bẹp Request A trễ theo đúng cơ chế sequence ID.
