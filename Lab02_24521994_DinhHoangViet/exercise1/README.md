# Exercise 1: Mini-React VNode Factory & DOM Mounting Engine

> **Môn học:** Thiết kế Giao diện Người dùng & Lập trình Web Hiện đại  
> **Sinh viên thực hiện:** Đinh Hoàng Việt  
> **MSSV:** 24521994  
> **Chuẩn công nghệ:** Thuần JavaScript ES Modules (Vanilla JS), Semantic HTML5, Zero Virtual DOM Library.

---

## 📌 Tổng Quan Dự Án

Dự án này là bài tập đầu tiên trong chuỗi Lab 02, hướng đến mục tiêu tìm hiểu và xây dựng từ đầu (from scratch) cơ chế cốt lõi của một thư viện UI hướng thành phần tương tự React:
1. **Virtual DOM Tree Construction (AST)**: Xây dựng cây phần tử ảo (VNode) thông qua factory function `createElement` và `createTextElement`.
2. **DOM Mounting Engine**: Chuyển đổi đệ quy từ cây VNode sang cây Real DOM node hiển thị trên trình duyệt thông qua hàm `renderToDOM`.
3. **XSS Immunity Contract**: Miễn nhiễm tuyệt đối với các cuộc tấn công Cross-Site Scripting (XSS) thông qua việc sử dụng `document.createTextNode()`, loại bỏ hoàn toàn `innerHTML`.

---

## 🏗️ Kiến Trúc & Hợp Đồng Kỹ Thuật

```
+-------------------------------------------------------------+
|                      User Application                        |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 1. Virtual Node Engine (mini-react.js)                      |
|    - createElement(type, props, ...children)                |
|    - createTextElement(value)                               |
|    - isVNode(node): Type Guard kiểm tra VNode hợp lệ        |
|    - Tự động làm phẳng mảng lồng nhau (flat children)       |
|    - Lọc bỏ null, undefined, boolean                        |
|    - Ném TypeError khi nhận object không hợp lệ             |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 2. DOM Mounting Engine (renderToDOM)                        |
|    - TEXT_ELEMENT  -> document.createTextNode               |
|    - HTML Elements -> document.createElement               |
|    - Event Handlers: onClick -> addEventListener('click')   |
|    - Attributes: className -> class, style                  |
|    - Bỏ qua props.children (không gắn thành HTML attr)      |
|    - Duyệt đệ quy con và gắn qua parent.appendChild         |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Real Browser DOM Tree                   |
+-------------------------------------------------------------+
```

### Các Hàm Cốt Lõi (`mini-react.js`):
1. **`createTextElement(value)`**:
   - Nhận giá trị `string` hoặc `number`, ép kiểu sang chuỗi `String(value)`.
   - Trả về Text VNode chuẩn:
     ```javascript
     {
       type: "TEXT_ELEMENT",
       props: { nodeValue: string, children: [] }
     }
     ```
2. **`createElement(type, props, ...children)`**:
   - Nhận tên thẻ `type`, thuộc tính `props`, và danh sách `children`.
   - Sử dụng `children.flat(Infinity)` để giải phóng mảng con lồng nhau.
   - Bỏ qua các giá trị `null`, `undefined`, `boolean`.
   - Tự động chuẩn hóa primitive (chuỗi, số) thành `TEXT_ELEMENT`.
   - Bắt buộc kiểm tra `isVNode(child)` và ném `TypeError` chi tiết nếu child là object không hợp lệ.
3. **`renderToDOM(vnode)`**:
   - Kiểm tra `!isVNode(vnode)` $\rightarrow$ ném `TypeError`.
   - Xử lý text bằng `document.createTextNode(vnode.props.nodeValue)`.
   - Xử lý phần tử bằng `document.createElement(vnode.type)`.
   - Gán sự kiện `on*` an toàn qua `addEventListener`, kiểm tra handler bắt buộc là `function`.
   - Đệ quy mount children qua `appendChild`, trả về Real DOM node mà không tạo thẻ bọc ngoài (zero wrapper div).

---

## 🛡️ Hợp Đồng Bảo Mật XSS (XSS Immunity)

- Hệ thống **tuyệt đối không sử dụng `innerHTML`** hoặc `outerHTML`.
- Khi người dùng truyền chuỗi chứa mã độc như:
  - `"<script>alert(1)</script>"`
  - `"<img onerror=alert(1)> Safe Text"`
- Hàm `renderToDOM` luôn ủy thác cho `document.createTextNode()`, khiến trình duyệt xử lý toàn bộ chuỗi dưới dạng văn bản tĩnh (Text Node). Mã độc hiển thị nguyên bản trên màn hình và **không thể thực thi**.

---

## 📁 Cấu Trúc Thư Mục Exercise 1

```
exercise1/
├── index.html               # Trang HTML demo mount giao diện vào phần tử #app
├── mini-react.js            # Module chứa createElement, createTextElement, renderToDOM
├── style.css                # CSS Variables, thiết kế giao diện demo responsive
├── test-runner.js           # Bộ kiểm thử tự động độc lập sử dụng console.assert
├── rule.md                  # Quy tắc kỹ thuật và ràng buộc phát triển
├── task_decomposition.md    # Phân rã nhiệm vụ (WBS) thành 4 bước thực hiện
├── prompt_log.md            # Nhật ký prompt engineering chi tiết từng bước
└── README.md                # Tài liệu tổng kết bài tập (File này)
```

---

## 🚀 Hướng Dẫn Chạy & Kiểm Thử

### Cách 1: Chạy trực tiếp trên Trình duyệt bằng Live Server (Khuyên dùng)
1. Mở thư mục bài tập trong **Visual Studio Code**.
2. Nhấp chuột phải vào file [`index.html`](./index.html) và chọn **"Open with Live Server"**.
3. Mở công cụ nhà phát triển bằng phím **`F12`**:
   - **Tab Console**: Xem báo cáo kết quả kiểm thử tự động từ [`test-runner.js`](./test-runner.js) (Toàn bộ 5 test case đều hiển thị màu xanh lá `PASS`).
   - **Tương tác**: Nhấp vào nút **"Click"** trên màn hình $\rightarrow$ Console in ra dòng chữ **`Ping`**.
   - **Tab Elements**: Kiểm tra cây DOM được mount bên trong `<div id="app">`:
     - Gốc là `<main id="root-view" role="main">`.
     - Chứa `<header class="hero">` và `<button class="btn-action">Click</button>`.
     - Chuỗi XSS nằm an toàn bên trong Text Node của `<p>`, không sinh ra thẻ `<img>` hay `<script>`.

### Cách 2: Chạy kiểm thử tự động với Node.js
Tại thư mục gốc của repository, chạy lệnh kiểm tra logic VNode và DOM:
```powershell
node -e "import('./Lab02_24521994_DinhHoangViet/exercise1/mini-react.js').then(m => { console.log('Exported APIs:', Object.keys(m)); })"
```

---

## 📊 Kết Quả Kiểm Thử (Automated Test Suite)

| Mã Test | Nội dung kiểm thử | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **TC-01** | Button tồn tại sau khi mount và có text "Click" | **PASS** | Xác nhận `renderToDOM` tạo phần tử chính xác |
| **TC-02** | Chuỗi HTML `"<img onerror=...>"` không tạo thẻ `<img>` | **PASS** | Miễn nhiễm XSS dạng tag injection |
| **TC-03** | Chuỗi `"<script>alert(1)</script>"` render thành Text Node | **PASS** | Không sinh thẻ `<script>`, script không thực thi |
| **TC-04** | Object con không hợp lệ bị từ chối bằng `TypeError` | **PASS** | Type Guard `isVNode` bảo vệ AST |
| **TC-05** | Cây DOM khớp 100% VNode và có 0 thẻ wrapper `div` thừa | **PASS** | Đảm bảo tính ngữ nghĩa Semantic HTML |

---

## 📝 Nhật Ký Commit (Git Conventional Commits)

- `2c25124`: `add task-decomposition,rule.md`
- `bfc08df`: `feat(core): implement createElement factory`
- `02cdc4b`: `feat(core): implement renderToDOM`
- `5a8467b`: `test: verify mounting and text safety`

