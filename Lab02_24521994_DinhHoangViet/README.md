# Lab 02: Mini-React Engine & Reactive Architecture

> **Môn học:** Thiết kế Giao diện Người dùng & Lập trình Web Hiện đại  
> **Sinh viên thực hiện:** Đinh Hoàng Việt  
> **MSSV:** 24521994  
> **Repository:** [https://github.com/Vietomato/24521994_DinhHoangViet](https://github.com/Vietomato/24521994_DinhHoangViet)

---

## 🎯 Mục Tiêu Tổng Thể Của Lab 02

Lab 02 tập trung nghiên cứu, thiết kế và tự xây dựng các thành phần kiến trúc cốt lõi của một thư viện/framework UI hiện đại hoàn toàn bằng **Vanilla JavaScript (ES Modules)**, không phụ thuộc vào bất kỳ thư viện Virtual DOM hay State Management bên ngoài nào:
- Hiểu rõ cơ chế biểu diễn giao diện dưới dạng cây phần tử ảo (Virtual DOM / AST).
- Nắm vững thuật toán chuyển đổi đệ quy từ VNode sang Real DOM Node và phòng chống lỗ hổng bảo mật XSS.
- Tự cài đặt cơ chế quản lý trạng thái phản ứng (`useState`) thông qua closure và con trỏ cursor.
- Thiết kế hệ thống ủy nhiệm sự kiện tập trung (Root Event Delegation Hub) với cấu trúc dữ liệu `WeakMap` để tối ưu hóa hiệu năng và bộ nhớ.

---

## 📂 Danh Sách Các Bài Tập (Lab Exercises)

| Thư mục | Tên bài tập | Trọng tâm công nghệ | Chi tiết tài liệu |
| :--- | :--- | :--- | :---: |
| [`exercise1/`](./exercise1/) | **Mini-React VNode Factory & DOM Mounting Engine** | • `createElement`, `createTextElement`<br>• `renderToDOM` đệ quy<br>• Miễn nhiễm XSS với `createTextNode`<br>• Semantic HTML5 (zero wrapper div) | [README Exercise 1](./exercise1/README.md) |
| [`exercise2/`](./exercise2/) | **Reactive State Machine & Delegation Hub** | • Closure `stateStore` & `resetCursor`<br>• Custom `useState` với Functional Updates<br>• Root Event Delegation Hub<br>• Quản lý Handler bằng `WeakMap` | [README Exercise 2](./exercise2/README.md) |
| [`exercise3/`](./exercise3/) | **Resilient State Machine & Skeleton Loader** | • 4-State Machine (`IDLE`/`LOADING`/`SUCCESS`/`ERROR`)<br>• Zero CLS CSS Pulse Skeleton<br>• Chống Race Condition bằng Sequence Counter<br>• Mock API với AbortSignal thật | [README Exercise 3](./exercise3/README.md) |

---

## 🚀 Hướng Dẫn Chạy Nhanh Toàn Bộ Dự Án

### 1. Mở Giao Diện Bằng Visual Studio Code & Live Server
1. Mở thư mục dự án trong **VS Code**.
2. Chuột phải vào bất kỳ file `index.html` nào:
   - Exercise 1: `Lab02_24521994_DinhHoangViet/exercise1/index.html`
   - Exercise 2: `Lab02_24521994_DinhHoangViet/exercise2/index.html`
   - Exercise 3: `Lab02_24521994_DinhHoangViet/exercise3/index.html`
3. Chọn **"Open with Live Server"**.

### 2. Chạy Các Bộ Kiểm Thử Tự Động (Automated Test Suites)
Mỗi bài tập đều được trang bị bộ kiểm thử độc lập chạy trực tiếp trên môi trường Node.js:

```powershell
# Chạy kiểm thử Exercise 1
node Lab02_24521994_DinhHoangViet/exercise1/test-runner.js

# Chạy kiểm thử Exercise 2 (Milestone 1, 2, 3)
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone1.js
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone2.js
node Lab02_24521994_DinhHoangViet/exercise2/test-milestone3.js

# Chạy kiểm thử Exercise 3 (Logic & 7 Scenarios)
node Lab02_24521994_DinhHoangViet/exercise3/test-data-feed-logic.js
node Lab02_24521994_DinhHoangViet/exercise3/test-scenarios.js
```

---

## 📜 Tiêu Chuẩn Cam Kết Mã Nguồn (Conventional Commits)

Dự án áp dụng chặt chẽ quy chuẩn **Atomic Commits** và **Conventional Commits**:
- `feat(core): implement createElement factory`
- `feat(core): implement renderToDOM`
- `test: verify mounting and text safety`
- `feat(state): implement stateStore and resetCursor engine`
- `feat(state): implement reactive useState dispatcher`
- `feat(events): attach root event delegation listener`
- `docs: add exercise 3 rules and task plan`
- `feat(ui): implement multi-state data component with skeleton feedback`


