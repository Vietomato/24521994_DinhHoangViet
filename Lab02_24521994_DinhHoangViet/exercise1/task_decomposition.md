# KẾ HOẠCH PHÂN RÃ NHIỆM VỤ (TASK DECOMPOSITION)
## Mini-React VNode & Mounting Engine

- **Môn học / Bài tập**: Lab 02 - Exercise 1
- **Sinh viên**: Đinh Hoàng Việt (MSSV: 24521994)
- **Tiêu chuẩn kỹ thuật**: Thuần JavaScript ES Modules, Semantic HTML5, Zero Virtual DOM Library.

---

## Tổng Quan Kiến Trúc
Hệ thống được chia thành 4 bước triển khai tuần tự:
1. **Bước 1**: Xây dựng cấu trúc HTML tối thiểu và các hàm tạo VNode (`createTextElement`, `createElement`).
2. **Bước 2**: Xây dựng hàm chuyển đổi VNode thành Real DOM (`renderToDOM`).
3. **Bước 3**: Xây dựng chương trình chạy test và kiểm tra tự động (`test-runner.js`).
4. **Bước 4**: Kiểm tra và nghiệm thu trên DevTools (kèm hướng dẫn chụp ảnh kết quả).

Hai commit triển khai cốt lõi bắt buộc theo chuẩn:
- `feat(core): implement createElement factory` (cho Bước 1)
- `feat(core): implement renderToDOM` (cho Bước 2)

---

## Chi Tiết Các Bước Triển Khai

### BƯỚC 1: Tạo Structure HTML Tối Thiểu & Các Hàm Tạo VNode
- **Mục tiêu**: 
  - Chuẩn bị khung HTML cơ bản hỗ trợ nạp ES Modules.
  - Cài đặt 2 hàm cốt lõi để tạo Virtual DOM Node (AST): `createTextElement(value)` và `createElement(type, props, ...children)`.
- **File cần tạo hoặc sửa**:
  - `index.html`
  - `mini-react.js`
- **Tiêu chí hoàn thành (Acceptance Criteria)**:
  1. `index.html`: Cấu trúc HTML5 chuẩn, chứa phần tử neo ngữ nghĩa `<main id="root"></main>`, nạp script bằng `<script type="module" src="./mini-react.js"></script>`. Tuyệt đối không lạm dụng `<div>` bọc ngoài.
  2. `createTextElement(value)` trong `mini-react.js`:
     - Nhận vào `value` (chuỗi hoặc số).
     - Trả về Text VNode chuẩn:
       ```javascript
       {
         type: "TEXT_ELEMENT",
         props: {
           nodeValue: String(value),
           children: []
         }
       }
       ```
  3. `createElement(type, props, ...children)` trong `mini-react.js`:
     - Nhận `type` (tên thẻ HTML), `props` (object hoặc null/undefined), và rest parameter `children`.
     - Làm phẳng mảng con đa cấp (`children.flat(Infinity)` hoặc thuật toán đệ quy tương đương).
     - Lọc bỏ các giá trị falsy không hiển thị (`null`, `undefined`, `false`).
     - **Kiểm tra kiểu dữ liệu**: Nếu một child là kiểu nguyên thủy (string, number), tự động chuyển hóa thành Text VNode bằng cách gọi `createTextElement(child)`. Nếu đã là object VNode thì giữ nguyên.
     - Trả về Element VNode chuẩn:
       ```javascript
       {
         type: type,
         props: {
           ...(props || {}),
           children: [ /* danh sách VNode con đã chuẩn hóa */ ]
         }
       }
       ```
  4. Xuất các hàm theo chuẩn ES Modules (`export { createElement, createTextElement }`).
- **Cách kiểm tra**:
  - Mở Console của trình duyệt hoặc chạy đoạn mã thử nghiệm:
    ```javascript
    import { createElement, createTextElement } from './mini-react.js';
    const vnode = createElement('header', { id: 'hdr' }, 'Hello', createElement('button', null, 'Click'));
    console.log(vnode);
    ```
  - Kiểm tra kết quả in ra: Cấu trúc object VNode đúng phân cấp, chuỗi `'Hello'` đã được bọc thành object `TEXT_ELEMENT`.
- **Commit message**:
  `feat(core): implement createElement factory`

---

### BƯỚC 2: Viết Hàm Chuyển VNode Thành DOM (`renderToDOM`)
- **Mục tiêu**: 
  - Cài đặt hàm `renderToDOM(vnode)` chuyển đổi đệ quy từ cây VNode sang cây Real DOM node.
  - Đảm bảo an toàn bảo mật, chống tấn công XSS và gắn kết đầy đủ thuộc tính, sự kiện.
- **File cần tạo hoặc sửa**:
  - `mini-react.js`
- **Tiêu chí hoàn thành (Acceptance Criteria)**:
  1. `renderToDOM(vnode)` nhận một VNode hợp lệ và trả về Real DOM Node (`Node` hoặc `HTMLElement`).
  2. **Phân nhánh xử lý theo kiểu VNode**:
     - Nếu `vnode.type === "TEXT_ELEMENT"`: Tạo node văn bản thuần bằng `document.createTextNode(vnode.props.nodeValue)`.
     - Nếu là phần tử HTML: Tạo phần tử bằng `document.createElement(vnode.type)`.
  3. **Xử lý Props & Event Listeners**:
     - Bỏ qua key `children`.
     - Nếu prop bắt đầu bằng `on` (ví dụ `onClick`, `onInput`): Đăng ký sự kiện thông qua `dom.addEventListener(eventType.toLowerCase(), handler)`.
     - Nếu prop là `className` hoặc `class`: Gán class cho phần tử (`dom.className = value`).
     - Nếu prop là `style`: Xử lý gán style (hỗ trợ chuỗi hoặc object CSS).
     - Các props khác: Gán qua `dom.setAttribute(key, value)`.
  4. **Đệ quy Children**:
     - Duyệt danh sách `vnode.props.children`, gọi đệ quy `renderToDOM(child)` và gắn vào phần tử cha qua `dom.appendChild(childDOM)`.
  5. **Bảo mật XSS**:
     - Tuyệt đối không dùng `innerHTML` hay `outerHTML`.
     - Chuỗi độc hại như `"<script>alert(1)</script>"` khi truyền vào VNode con phải biến thành `TextNode` thông qua `document.createTextNode`, hiển thị nguyên văn dạng chuỗi và **không được phép thực thi**.
  6. Xuất hàm `renderToDOM` theo chuẩn ES Modules (`export { renderToDOM }`).
- **Cách kiểm tra**:
  - Thử nghiệm mount một cây VNode mẫu có chứa XSS payload và sự kiện:
    ```javascript
    const vnode = createElement('section', { className: 'card' },
      createElement('h2', null, 'Tiêu đề an toàn'),
      createElement('p', null, '<script>alert(1)</script>'),
      createElement('button', { onClick: () => alert('Đã bấm!') }, 'Thử click')
    );
    const dom = renderToDOM(vnode);
    document.getElementById('root').appendChild(dom);
    ```
  - Kiểm tra trên trình duyệt: Thẻ xuất hiện đúng giao diện, chuỗi `<script>alert(1)</script>` hiển thị như chữ viết bình thường, bấm button kích hoạt được sự kiện click.
- **Commit message**:
  `feat(core): implement renderToDOM`

---

### BƯỚC 3: Viết Program Để Run Test Và Checking
- **Mục tiêu**: 
  - Xây dựng bộ kiểm thử tự động độc lập trong `test-runner.js` để kiểm chứng toàn bộ các hàm cốt lõi và các ràng buộc kỹ thuật.
- **File cần tạo hoặc sửa**:
  - `test-runner.js`
  - `index.html` (liên kết script chạy test runner hoặc mở trực tiếp trang test)
- **Tiêu chí hoàn thành (Acceptance Criteria)**:
  1. Xây dựng mini assertion utility đơn giản:
     - `assert(condition, message)`: Đánh dấu Pass / Fail.
     - `assertEqual(actual, expected, message)`: So sánh giá trị thực tế và kỳ vọng.
  2. Bao phủ đầy đủ 5 Test Cases trọng yếu:
     - **TC1 - Text VNode**: Kiểm tra `createTextElement("Hello")` sinh ra object type `TEXT_ELEMENT`, `nodeValue === "Hello"`, `children === []`.
     - **TC2 - Element VNode & Flattening**: Kiểm tra `createElement` tạo đúng tag ngữ nghĩa (`<main>`, `<header>`), làm phẳng mảng con lồng nhau, tự động ép string/number thành Text VNode.
     - **TC3 - DOM Mounting**: Kiểm tra `renderToDOM` trả về đúng đối tượng `HTMLElement`, đúng `tagName`, số lượng `childNodes` khớp với `children`.
     - **TC4 - Props & Event Handlers**: Kiểm tra gán đúng thuộc tính `id`, `class` và event listener `onClick` kích hoạt được hàm callback khi dispatch `click`.
     - **TC5 - XSS Immunity**: Kiểm tra chuỗi `"<script>alert(1)</script>"` sau khi mount có `nodeType === Node.TEXT_NODE` (giá trị 3), kiểm tra thẻ `<script>` con không hề tồn tại trong DOM (`dom.querySelector('script') === null`).
  3. Báo cáo kết quả trực quan trên Console (hoặc render ra màn hình HTML) với định dạng rõ ràng:
     - `[PASS] TC1: createTextElement creates standardized text VNode`
     - `[PASS] TC5: XSS payload renders strictly as text, zero script execution`
     - Tổng kết: `Tests: 5 passed, 0 failed`.
- **Cách kiểm tra**:
  - Mở file trên trình duyệt và kiểm tra Console hoặc giao diện test runner.
  - Toàn bộ 5 test case đều báo PASS (xanh lá), không có exception/lỗi chưa được xử lý.
- **Commit message**:
  `test(core): add automated test runner for vnode and dom mounting`

---

### BƯỚC 4: Kiểm Tra Bằng DevTools & Hướng Dẫn Chụp Ảnh Kết Quả
- **Mục tiêu**: 
  - Khởi chạy ứng dụng hoàn chỉnh trên trình duyệt.
  - Sử dụng Chrome/Edge DevTools để thanh tra cây DOM thực tế, xác nhận cấu trúc ngữ nghĩa (semantic tree) và cơ chế miễn nhiễm XSS.
  - Cung cấp kịch bản chi tiết để chụp các ảnh màn hình bằng chứng phục vụ chấm điểm.
- **File cần tạo hoặc sửa**:
  - `index.html` (chứa giao diện demo hoàn chỉnh với các thẻ ngữ nghĩa: `<header>`, `<main>`, `<section>`, `<article>`, `<button>`).
- **Tiêu chí hoàn thành (Acceptance Criteria)**:
  1. Giao diện demo mount thành công vào DOM mà không cần thẻ `<div>` bọc ngoài dư thừa.
  2. Tab **Elements** trong DevTools hiển thị cây DOM phân cấp chuẩn HTML5 ngữ nghĩa.
  3. Chuỗi XSS hiển thị trên tab **Elements** là một Text Node bình thường nằm trong dấu ngoặc kép `"..."`, không trở thành HTML Element `<script>`.
  4. Tab **Console** sạch sẽ, không có lỗi runtime hoặc cảnh báo bảo mật.
- **Hướng dẫn chi tiết cách kiểm tra và chụp ảnh DevTools**:
  - **Ảnh 1: Cây DOM Ngữ Nghĩa (Semantic DOM Tree)**:
    - *Thao tác*: Mở trình duyệt -> Nhấn `F12` (hoặc chuột phải chọn `Inspect`) -> Chọn tab **Elements**.
    - *Vị trí kiểm tra*: Mở rộng thẻ `<main id="root">`, bung các thẻ con `<header>`, `<section>`, `<button>`.
    - *Mục tiêu hình chụp*: Thể hiện cấu trúc cây DOM rõ ràng với các thẻ ngữ nghĩa, không có `<div>` thừa thãi.
  - **Ảnh 2: Bằng chứng Miễn Nhiễm XSS (XSS Immunity Proof)**:
    - *Thao tác*: Trong tab **Elements**, bấm mở rộng phần tử `<section>` hoặc `<p>` chứa chuỗi thử nghiệm `"<script>alert(1)</script>"`.
    - *Mục tiêu hình chụp*: Cho thấy DevTools hiển thị `"\"<script>alert(1)</script>\""` dưới dạng text node màu xám/đen thông thường; xác nhận không có node `<script>` thực tế nào được trình duyệt biên dịch.
  - **Ảnh 3: Kết quả Kiểm Thử Tự Động (Test Runner Console)**:
    - *Thao tác*: Chuyển sang tab **Console**.
    - *Mục tiêu hình chụp*: Chụp lại bảng log kết quả của `test-runner.js` hiển thị 100% Pass cho toàn bộ 5 test cases.
- **Commit message**:
  `docs(audit): verify semantic dom and xss immunity via devtools`
