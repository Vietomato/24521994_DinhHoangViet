# QUY TẮC TRIỂN KHAI MINI-REACT VNODE & MOUNTING ENGINE

Tài liệu này xác định các quy tắc kỹ thuật, ràng buộc kiến trúc và quy trình triển khai cho hệ thống Mini-React VNode và Mounting Engine.

---

## 1. Mục Tiêu Dự Án
- Xây dựng một engine tạo Virtual Node (VNode) và chuyển đổi sang Real DOM node (Mounting) tối giản bằng JavaScript thuần.
- Hiểu sâu nguyên lý hoạt động cốt lõi của React: cách `createElement` tạo ra cây phần tử ảo và cách thuật toán mount biến cây ảo đó thành phần tử DOM thực tế hiển thị trên trình duyệt.

---

## 2. Ràng Buộc Công Nghệ & Môi Trường
- **Thuần JavaScript (Vanilla JS)**: Tuyệt đối không sử dụng thư viện React, ReactDOM hoặc bất kỳ thư viện Virtual DOM thứ ba nào (như Preact, Snabbdom, v.v.).
- **Chuẩn Module**: Bắt buộc sử dụng JavaScript ES Modules (`import` / `export`).
- **Môi trường chạy**: Trình duyệt hiện đại hỗ trợ ES Modules hoặc môi trường test runner.

---

## 3. Quy Tắc Triển Khai 3 Hàm Cốt Lõi

### 3.1. `createTextElement(value)`
- **Mục đích**: Chuyển đổi một giá trị nguyên thủy (string, number) thành một Text VNode có cấu trúc đồng nhất với Element VNode.
- **Quy chuẩn VNode Text**:
  ```javascript
  {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(value),
      children: []
    }
  }
  ```
- **Ràng buộc**: `nodeValue` phải được ép kiểu về chuỗi (`String(value)`).

### 3.2. `createElement(type, props, ...children)`
- **Mục đích**: Tạo một VNode đại diện cho phần tử DOM.
- **Tham số**:
  - `type` *(string)*: Tên thẻ HTML (ví dụ: `'header'`, `'main'`, `'button'`, v.v.).
  - `props` *(object | null)*: Thuộc tính của thẻ (ví dụ: `{ id: 'app', className: 'container' }`). Nếu là `null` hoặc `undefined`, khởi tạo thành object rỗng `{}`.
  - `...children` *(bất kỳ)*: Danh sách phần tử con (có thể là VNode, string, number, hoặc mảng lồng nhau).
- **Quy chuẩn xử lý**:
  - Hỗ trợ làm phẳng danh sách `children` (flatten array nếu truyền vào mảng lồng nhau).
  - Lọc bỏ các giá trị không hợp lệ (như `null`, `undefined`, `false`).
  - **Kiểm tra kiểu dữ liệu**: Nếu một child là kiểu dữ liệu nguyên thủy (string hoặc number), phải tự động gọi `createTextElement(child)` để chuẩn hóa thành Text VNode.
- **Quy chuẩn VNode Element**:
  ```javascript
  {
    type: "main",
    props: {
      ...props,
      children: [ /* danh sách các VNode con đã được chuẩn hóa */ ]
    }
  }
  ```

### 3.3. `renderToDOM(vnode)`
- **Mục đích**: Chuyển đổi đệ quy một cây VNode thành cây Real DOM node tương ứng và trả về node gốc.
- **Quy chuẩn xử lý**:
  1. **Xử lý Text Node**: Nếu `vnode.type === "TEXT_ELEMENT"`, sử dụng `document.createTextNode(vnode.props.nodeValue)`.
  2. **Xử lý Element Node**:
     - Tạo element thực bằng `document.createElement(vnode.type)`.
     - Duyệt qua các keys trong `vnode.props`:
       - Bỏ qua key `children`.
       - Nếu là sự kiện (bắt đầu bằng `on`, ví dụ `onClick`): gắn event listener tương ứng (`addEventListener`).
       - Nếu là thuộc tính `className` hoặc `class`: gán class tương ứng.
       - Nếu là style: xử lý gán style tương ứng (dạng chuỗi hoặc object).
       - Các thuộc tính khác: gán trực tiếp hoặc dùng `setAttribute`.
  3. **Đệ quy Children**: Duyệt qua từng child trong `vnode.props.children`, gọi đệ quy `renderToDOM(child)` và thêm vào element cha qua `parent.appendChild(childDOMNode)`.
  4. **Giá trị trả về**: Trả về `DOMNode` (Node hoặc Element) để phía gọi có thể gắn vào container bất kỳ.

---

## 4. Ràng Buộc Ngữ Nghĩa & An Toàn Mã Nguồn

### 4.1. Ngữ Nghĩa HTML (Semantic HTML)
- Ưu tiên tối đa việc sử dụng các thẻ HTML có ngữ nghĩa: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`, `<button>`, `<h1>`-`<h6>`, `<p>`.
- **Không lạm dụng thẻ `<div>`**: Chỉ sử dụng khi không có thẻ ngữ nghĩa nào khác phù hợp.
- **Không tạo phần tử bao bọc (wrapper) thừa thãi**: Cây VNode chỉ chứa đúng các node cần thiết, không tự ý bọc thêm container không có ý nghĩa.

### 4.2. An Toàn Bảo Mật & Phòng Chống XSS (Cross-Site Scripting)
- **Tuyệt đối không sử dụng `innerHTML` hoặc `outerHTML`** trong toàn bộ mã nguồn.
- Mọi nội dung text truyền vào `children` (kể cả chuỗi độc hại như `"<script>alert(1)</script>"`, `"<img src=x onerror=alert(1)>"`) phải được hiển thị dưới dạng văn bản thuần túy (plain text) thông qua `document.createTextNode()` hoặc `nodeValue`.
- Script hoặc tag giả mạo trong chuỗi text **tuyệt đối không được thực thi**.

---

## 5. Quy Trình Kiểm Thử, Ghi Log & Quản Lý Mã Nguồn

### 5.1. Kiểm Thử (Testing & DevTools)
- Cây DOM sau khi mount vào trang HTML (`index.html`) phải kiểm tra được trực tiếp trên DevTools (Tab **Elements**).
- Cần có bộ test case tự động trong `test-runner.js` để kiểm chứng:
  - Khởi tạo Text VNode đúng cấu trúc.
  - Khởi tạo Element VNode và tự động chuẩn hóa text children.
  - Mount cây VNode phức tạp nhiều tầng với thẻ ngữ nghĩa.
  - Xử lý chuỗi XSS an toàn (text hiển thị nguyên văn, không chạy script).
  - Xử lý các props, event listeners.

### 5.2. Quản Lý Phiên Bản Bằng Git
- Khởi tạo Git repository trong thư mục dự án (`git init`).
- Thực hiện commit có ý nghĩa theo từng giai đoạn (Conventional Commits):
  - `feat`: Thêm tính năng mới (VNode, Mounting, Event,...).
  - `test`: Viết test cases.
  - `docs`: Cập nhật tài liệu, log.
  - `fix`: Sửa lỗi.

### 5.3. Nhật Ký Tiến Trình (`prompt-log.md`)
- Ghi chép đầy đủ:
  - Thời gian, mục tiêu của từng bước thực hiện.
  - Prompt yêu cầu và kết quả đạt được.
  - Các vấn đề phát sinh và cách giải quyết.
