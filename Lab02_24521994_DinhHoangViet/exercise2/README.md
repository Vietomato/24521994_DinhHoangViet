# Exercise 2: Reactive State Machine & Delegation Hub

> **Môn học:** Thiết kế Giao diện Người dùng & Lập trình Web Hiện đại  
> **Sinh viên thực hiện:** Đinh Hoàng Việt  
> **MSSV:** 24521994  
> **Chuẩn công nghệ:** Thuần JavaScript ES Modules (Vanilla JS), Closure-based State Store, Root Event Delegation, WeakMap Handler Mapping.

---

## 📌 Tổng Quan Dự Án

Bài tập Exercise 2 phát triển tiếp nối trên nền tảng engine VNode từ Exercise 1, nhằm giải quyết hai bài toán kinh điển trong kiến trúc thư viện frontend:
1. **Reactive State Machine (`useState`)**: Xây dựng cơ chế quản lý trạng thái phản ứng dựa trên closure và con trỏ cursor, hỗ trợ lưu trữ trạng thái qua nhiều vòng đời render và cập nhật tự động khi state thay đổi.
2. **Root Event Delegation Hub**: Loại bỏ hoàn toàn việc gắn `addEventListener` phân tán trên từng phần tử con. Thay vào đó, toàn bộ sự kiện được ủy nhiệm tập trung tại phần tử gốc (Root Element) với đúng **1 native listener** duy nhất cho mỗi loại sự kiện, phân phối sự kiện an toàn thông qua cấu trúc dữ liệu `WeakMap`.

---

## 🏗️ Kiến Trúc Luồng Dữ Liệu (Unidirectional Data Flow)

Hệ thống tuân thủ nghiêm ngặt mô hình luồng dữ liệu một chiều:
```
+-------------------------------------------------------------------------+
|                              USER EVENT                                 |
|               (Click, Input được bắt tại Root Delegation)                |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  DELEGATION HUB (WeakMap Lookup)                        |
|   - Duyệt bubbling từ target lên root                                   |
|   - Tìm handler tương ứng đã đăng ký trong elementHandlersMap          |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  STATE SETTER (useState Closure Slot)                   |
|   - Nhận giá trị mới hoặc updater function: (prevState) => newState     |
|   - So sánh Object.is để tránh render thừa                              |
|   - Cập nhật stateStore[slotIndex]                                      |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                     DISPATCHER / RENDER ENGINE                          |
|   - Tự động gọi resetCursor() đưa cursor về 0                           |
|   - Tái thực thi hàm component để sinh cây VNode mới                     |
|   - renderToDOM() chuyển VNode sang Real DOM                            |
|   - root.replaceChildren(newDOM)                                        |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             UPDATED UI                                  |
|         (Giao diện đồng bộ với trạng thái mới nhất của store)            |
+-------------------------------------------------------------------------+
```

---

## ⚙️ Các Thành Phần Cốt Lõi (`reactive-engine.js`)

### 1. State Store & Cursor Closure (`Milestone 1`)
- **`stateStore`** và **`cursor`** được bao bọc an toàn trong closure, ngăn chặn việc truy cập hoặc chỉnh sửa tùy tiện từ bên ngoài.
- Hàm **`resetCursor()`** chỉ làm nhiệm vụ đưa con trỏ `cursor` về vị trí `0` trước mỗi lượt render, tuyệt đối không xóa hoặc khởi tạo lại dữ liệu trong `stateStore`.

### 2. Reactive `useState` Hook (`Milestone 2`)
- **Cơ chế Slot Capture**: Mỗi lần gọi `useState(initialValue)` chiếm một vị trí slot tương ứng với `cursor++`.
- **Hỗ trợ Functional Updates**: Hàm `setter` cho phép truyền giá trị trực tiếp hoặc updater callback `(prev) => next`, luôn đảm bảo nhận giá trị state mới nhất.
- **Tự Động Kích Hoạt Render (Reactive Dispatcher)**: Sau khi store được cập nhật giá trị mới, hệ thống tự động kích hoạt lượt render tiếp theo mà không đòi hỏi người dùng phải gọi render thủ công.
- **Chính sách `Object.is`**: Nếu giá trị mới không thay đổi so với giá trị hiện tại, dispatcher sẽ bỏ qua lượt render dư thừa.

### 3. Root Event Delegation Hub (`Milestone 3`)
- **Single Listener per Event Type**: Đăng ký duy nhất 1 bộ lắng nghe sự kiện trên phần tử `#app` (Root Element). Tuyệt đối không gắn `addEventListener` hay inline handler lên từng nút bấm hoặc phần tử con.
- **Quản lý Handler bằng `WeakMap`**:
  ```javascript
  const elementHandlersMap = new WeakMap();
  ```
  - Cho phép liên kết phần tử DOM với hàm xử lý sự kiện mà không gắn trực tiếp thuộc tính vào DOM node.
  - Tự động thu dọn rác (Garbage Collection) khi phần tử bị gỡ khỏi cây DOM, loại trừ hoàn toàn nguy cơ rò rỉ bộ nhớ (Memory Leak).
- **Hỗ trợ Event Bubbling**: Khi người dùng nhấp vào thẻ con (ví dụ thẻ `<span>` bên trong một `<button>`), thuật toán tìm kiếm ngược từ `event.target` lên đến `root` sẽ kích hoạt chính xác handler của nút cha.

---

## 📁 Cấu Trúc Thư Mục Exercise 2

```
exercise2/
├── index.html               # Trang test bench và giao diện demo trực quan trên trình duyệt
├── reactive-engine.js       # Module hoàn chỉnh chứa stateStore, useState, root delegation
├── test-milestone1.js       # Unit test cho Milestone 1: stateStore & resetCursor (27 assertions)
├── test-milestone2.js       # Unit test cho Milestone 2: useState dispatcher (31 assertions)
├── test-milestone3.js       # Unit test cho Milestone 3: root event delegation (19 assertions)
├── rule.md                  # Quy tắc kỹ thuật và tiêu chí nghiệm thu cho từng milestone
├── task-decomposition.md    # Phân rã tiến độ WBS và checklist nghiệm thu 4 milestone
├── prompt-log.md            # Nhật ký prompt engineering chi tiết kèm audit log
└── README.md                # Tài liệu tổng kết bài tập (File này)
```

---

## 🚀 Hướng Dẫn Chạy & Kiểm Thử

### 1. Chạy Bộ Kiểm Thử Tự Động (Automated Test Suites)
Dự án được trang bị 3 kịch bản kiểm thử độc lập cho từng milestone, có thể chạy trực tiếp bằng Node.js:

```powershell
# Kiểm tra Milestone 1: stateStore & resetCursor
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone1.js

# Kiểm tra Milestone 2: reactive useState dispatcher
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone2.js

# Kiểm tra Milestone 3: root event delegation hub
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone3.js
```

### 2. Kiểm Thử Trực Quan trên Trình Duyệt (Test Bench)
1. Mở file [`index.html`](./index.html) bằng **Live Server** trên VS Code.
2. Mở **F12 $\rightarrow$ Tab Console**:
   - Theo dõi log tự động của hệ thống: khởi tạo delegation, kích hoạt state updates, render đếm số lượt.
3. Thực hiện tương tác:
   - Nhấp vào các nút tăng bộ đếm, chuyển đổi toggle $\rightarrow$ UI phản ứng mượt mà, số liệu cập nhật ngay lập tức.
   - Kiểm tra tab **Elements**: Chỉ có duy nhất 1 event listener tại phần tử gốc `#app`, các nút con hoàn toàn không có listener cục bộ.

---

## 📊 Kết Quả Nghiệm Thu Các Milestone

| Milestone | Nội dung triển khai | Kết quả kiểm thử | Trạng thái Git Commit |
| :--- | :--- | :---: | :--- |
| **Milestone 1** | Closure-based `stateStore` & `resetCursor()` | **27/27 PASS** | `72757d8`: `feat(state): implement stateStore and resetCursor engine` |
| **Milestone 2** | Reactive `useState` dispatcher & slot capture | **31/31 PASS** | `2866b8f`: `feat(state): implement reactive useState dispatcher` |
| **Milestone 3** | Root Event Delegation Hub & `WeakMap` mapping | **19/19 PASS** | `e8760e0`: `feat(events): attach root event delegation listener` |
| **Milestone 4** | Lắp ráp Reactive Todo Application | *Sẵn sàng triển khai* | *Milestone tiếp theo* |

---

## 📝 Quy Chuẩn Cam Kết Mã Nguồn (Conventional Commits)

Toàn bộ quá trình phát triển tuân thủ nghiêm ngặt quy tắc commit nguyên tử (Atomic Commits):
- Mỗi milestone có commit message độc lập, rõ ràng theo đúng cam kết trong `task-decomposition.md`.
- Mọi thay đổi đều được kiểm thử và xác nhận kết quả trước khi commit.

