# NHẬT KÝ PROMPT & TIẾN TRÌNH PHÁT TRIỂN (PROMPT LOG)

Dự án: **Mini-React VNode & Mounting Engine**  
Tác giả: Đinh Hoàng Việt - 24521994  
Mục tiêu: Xây dựng mini Virtual DOM engine (VNode creation & mounting) bằng JavaScript thuần.

---

## Bước 1: Thiết lập quy tắc dự án (`rule.md`)
- **Thời gian**: 2026-10-16 23:05
- **Yêu cầu (Prompt)**:
  > Tạo file `rule.md` chứa các quy tắc triển khai cần thiết cho việc xây dựng mini-react vnode and mounting engine bằng javascript (yêu cầu 3 hàm: `createElement`, `createTextElement`, `renderToDOM`; các ràng buộc về ES Modules, semantic HTML, XSS prevention, Git và prompt log).
- **Hành động đã thực hiện**:
  - Tạo tài liệu [`rule.md`](./rule.md) bao gồm 5 phần chính:
    1. Mục tiêu dự án.
    2. Ràng buộc công nghệ & môi trường (ES Modules, Vanilla JS).
    3. Quy tắc chi tiết triển khai 3 hàm cốt lõi (`createTextElement`, `createElement`, `renderToDOM`).
    4. Ràng buộc ngữ nghĩa HTML và an toàn bảo mật (phòng chống XSS, cấm `innerHTML`).
    5. Quy trình kiểm thử với DevTools, unit tests trên `test-runner.js`, quản lý mã nguồn bằng Git và ghi log.
- **Kết quả**: Đã tạo thành công [`rule.md`](./rule.md).

---

## Bước 2: Lập kế hoạch phân rã nhiệm vụ (`task_decomposition.md`)
- **Thời gian**: 2026-10-16 23:25
- **Yêu cầu (Prompt)**:
  > Tiếp đến tạo task_decomposition trong file task-decomposition để chia thành các bước nhỏ:  
  > 1. Tạo structure HTML tối thiểu vs các hàm tạo vnode  
  > 2. Viết hàm chuyển vnode thành dom  
  > 3. Viết program để run test và checking  
  > 4. Kiểm tra bằng devtools (có thể hướng dẫn tôi kiểm tra bằng devtools để chụp lại ảnh kết quả)  
  >   
  > Ở mỗi bước cần có mục tiêu, file cần tạo hoặc sửa, tiêu chí hoàn thành, cách kiểm tra, commit message.  
  > Sau khi xong, có Hai commit triển khai chính phải có tên:  
  > `feat(core): implement createElement factory`  
  > `feat(core): implement renderToDOM`  
  >   
  > Chỉ lập kế hoạch, chưa viết code và không tự commit.
- **Hành động đã thực hiện**:
  - Cập nhật [`task_decomposition.md`](./task_decomposition.md) phân chia rõ 4 bước tuần tự:
    1. Bước 1: Cấu trúc HTML tối thiểu & Factory tạo VNode (`createElement`, `createTextElement`).
    2. Bước 2: Hàm chuyển VNode thành DOM (`renderToDOM`) với cơ chế phòng chống XSS.
    3. Bước 3: Bộ chạy test tự động (`test-runner.js`) kiểm thử 5 ca trọng yếu.
    4. Bước 4: Kiểm tra bằng DevTools và hướng dẫn chi tiết kịch bản chụp 3 ảnh màn hình kết quả.
  - Xác định chuẩn xác 2 commit chính: `feat(core): implement createElement factory` và `feat(core): implement renderToDOM`.
  - Tuân thủ quy định: chỉ lập kế hoạch, chưa viết code và không tự commit trong bước phân rã.
- **Kết quả**: Hoàn thiện toàn bộ tài liệu [`task_decomposition.md`](./task_decomposition.md).

---

## Bước 3: Triển khai VNode Creation Engine (`mini-react.js`, `index.html`)
- **Thời gian**: 2026-10-16 23:32
- **Yêu cầu (Prompt)**:
  > Đọc rule.md và task_decomposition.md. Thực hiện bước tạo VNode.  
  > Tạo index.html tối thiểu và mini-react.js.  
  > Trong mini-react.js:  
  > - Export createElement và createTextElement.  
  > - VNode có dạng { type, props }, trong props có children.  
  > - Text VNode dùng type là "TEXT_ELEMENT".  
  > - Chuyển children kiểu string hoặc number thành text VNode.  
  > - Giữ nguyên children là VNode hợp lệ.  
  > - Bỏ qua null, undefined và boolean.  
  > - Hỗ trợ mảng children lồng nhau.  
  > - Viết type guard nhận diện VNode.  
  > - Ném TypeError khi children là object không hợp lệ.  
  > Chưa viết renderToDOM.  
  > Chưa nạp file JavaScript chưa tồn tại trong index.html.  
  > Giải thích ngắn code và hướng dẫn kiểm tra phần tạo VNode.  
  > Không tự commit.
- **Hành động đã thực hiện**:
  - Triển khai [`mini-react.js`](./mini-react.js):
    1. Hàm `isVNode(node)`: Type guard kiểm tra đối tượng có phải VNode hợp lệ (`type` là string, `props` là object, `props.children` là mảng).
    2. Hàm `createTextElement(value)`: Trả về Text VNode chuẩn dạng `{ type: "TEXT_ELEMENT", props: { nodeValue: String(value), children: [] } }`.
    3. Hàm `createElement(type, props, ...children)`:
       - Làm phẳng mảng `children` lồng nhau đa cấp bằng `flat(Infinity)`.
       - Lọc bỏ `null`, `undefined`, `boolean`.
       - Chuẩn hóa kiểu `string` / `number` thành Text VNode thông qua `createTextElement`.
       - Giữ nguyên VNode con nếu thỏa mãn `isVNode`.
       - Bắt lỗi và ném `TypeError` chi tiết nếu child là object không hợp lệ.
       - Trả về VNode `{ type, props: { ...(props || {}), children: normalizedChildren } }`.
  - Xây dựng [`index.html`](./index.html):
    - Khung HTML5 ngữ nghĩa chuẩn (`<main id="root">`, `<header>`, `<h1>`, `<p>`, không dùng thẻ `<div>`).
    - Nạp module `mini-react.js` qua thẻ `<script type="module">` để kiểm thử thực tế trên browser console.
  - Tuân thủ: Chưa viết `renderToDOM`, không tự commit.
- **Kết quả**: Tạo thành công [`mini-react.js`](./mini-react.js) và [`index.html`](./index.html), kiểm thử thành công qua Node.js và sẵn sàng kiểm tra trên DevTools.

---

## Bước 4: Triển khai hàm chuyển VNode sang Real DOM (`renderToDOM`)
- **Thời gian**: 2026-10-16 23:40
- **Yêu cầu (Prompt)**:
  > Đọc rule.md, task_decomposition.md và code hiện tại.  
  > Thêm hàm export renderToDOM(vnode) vào mini-react.js.  
  > Yêu cầu:  
  > - Kiểm tra VNode trước khi xử lý.  
  > - Dùng document.createTextNode cho text VNode.  
  > - Dùng document.createElement cho element VNode.  
  > - Chuyển className thành thuộc tính class.  
  > - Hỗ trợ onClick bằng addEventListener.  
  > - Event handler phải là function.  
  > - Không gán children thành thuộc tính HTML.  
  > - Render các phần tử con bằng đệ quy.  
  > - Không dùng innerHTML để render children.  
  > - Không tạo wrapper thừa.  
  > - Trả về DOM node để bên gọi tự mount.  
  > Hướng dẫn kiểm tra hàm trên trình duyệt.  
  > Không tự commit.  
  > đưa vào prompt-log
- **Hành động đã thực hiện**:
  - Bổ sung hàm `renderToDOM(vnode)` vào [`mini-react.js`](./mini-react.js):
    1. Kiểm tra tính hợp lệ của VNode bằng `isVNode(vnode)` trước khi xử lý; ném `TypeError` chi tiết nếu không hợp lệ.
    2. Với text VNode (`vnode.type === "TEXT_ELEMENT"`): Khởi tạo bằng `document.createTextNode(vnode.props.nodeValue)` (chống XSS tuyệt đối).
    3. Với element VNode: Khởi tạo bằng `document.createElement(vnode.type)` mà không bọc thêm bất kỳ wrapper nào.
    4. Xử lý props & attributes:
       - Bỏ qua key `children` (không đưa vào thuộc tính HTML).
       - Chuyển `className` hoặc `class` thành thuộc tính `class`.
       - Nhận diện sự kiện bắt đầu bằng `on` (ví dụ `onClick`); kiểm tra handler bắt buộc là `function` (ném `TypeError` nếu sai kiểu), đăng ký qua `addEventListener`.
       - Xử lý thuộc tính `style` (hỗ trợ chuỗi hoặc object CSS).
       - Xử lý các thuộc tính HTML khác qua `setAttribute`.
    5. Duyệt đệ quy mảng `vnode.props.children`, gọi `renderToDOM(child)` và gắn vào cha bằng `dom.appendChild(childDOM)`. Tuyệt đối không dùng `innerHTML`.
    6. Trả về Real DOM node trực tiếp để bên gọi tự quyết định vị trí mount.
  - Cập nhật [`index.html`](./index.html):
    - Xây dựng giao diện demo hoàn chỉnh dùng các thẻ ngữ nghĩa: `<article>`, `<header>`, `<section>`, `<button>`, `<p>`.
    - Tích hợp nút bấm kiểm tra sự kiện `onClick`.
    - Tích hợp đoạn văn bản kiểm thử chuỗi XSS `"<script>alert(1)</script>"`.
  - Tuân thủ: Không tự commit.
- **Kết quả**: Triển khai hoàn tất `renderToDOM`, vượt qua các bài kiểm thử tự động với mock DOM, giao diện demo trên trình duyệt hoạt động chính xác.

---

## Bước 5: Xây dựng Test Runner & Kiểm chứng tự động (`test-runner.js`)
- **Thời gian**: 2026-10-16 23:54
- **Yêu cầu (Prompt)**:
  > Đọc các quy tắc và code hiện tại.  
  > Tạo test-runner.js và nạp bằng script type="module" trong index.html.  
  > Trang cần có phần tử gốc id="app" để mount giao diện.  
  > Dùng createElement để tạo cây VNode sau:  
  > - main: id="root-view", role="main".  
  > - Trong main có header với className="hero".  
  > - Trong header có h1 chứa "Mini React Engine".  
  > - Trong header có p chứa chuỗi "<img onerror=alert(1)> Safe Text".  
  > - Trong main có button chứa "Click".  
  > - onClick của button ghi "Ping" vào Console.  
  > Mount bằng: root.replaceChildren(renderToDOM(vApp));  
  > Thêm kiểm tra bằng console.assert:  
  > - Button tồn tại sau khi mount.  
  > - Chuỗi HTML trong children không tạo phần tử img.  
  > - Chuỗi "<script>alert(1)</script>" được render thành text, không tạo phần tử script.  
  > - Object children không hợp lệ bị từ chối.  
  > - Cây DOM khớp cây VNode và không có wrapper thừa.  
  > Hướng dẫn tôi chạy bằng Live Server, kiểm tra Console, bấm button và xem cây DOM trong Elements.  
  > Không khẳng định kiểm tra thành công nếu chưa thực sự chạy.  
  > Không tự commit.
- **Hành động đã thực hiện**:
  - Triển khai [`test-runner.js`](./test-runner.js):
    1. Lấy phần tử gốc `#app`.
    2. Khởi tạo cây `vApp` chính xác theo đặc tả đề bài với `id="root-view"`, `role="main"`, `header.hero`, tiêu đề `h1`, thẻ `p` chứa payload XSS `"<img onerror=alert(1)> Safe Text"`, và nút bấm `button` ghi `"Ping"` vào Console khi click.
    3. Thực hiện mount bằng cú pháp: `root.replaceChildren(renderToDOM(vApp))`.
    4. Triển khai 5 bộ kiểm thử tự động bằng `console.assert`:
       - `console.assert(buttonEl !== null && buttonEl.textContent === 'Click')`
       - `console.assert(imgEl === null && pEl.textContent === imgPayload)`
       - `console.assert(scriptTag === null && scriptTestDOM.childNodes[0].nodeType === Node.TEXT_NODE)`
       - `console.assert(rejectedInvalidChild && rejectedInvalidMount)`
       - `console.assert(mainEl.children.length === 2 && divInsideMain.length === 0)`
  - Cập nhật [`index.html`](./index.html):
    - Đặt container mount gốc `<div id="app"></div>`.
    - Nạp `test-runner.js` bằng `<script type="module" src="./test-runner.js"></script>`.
    - Liên kết stylesheet [`style.css`](./style.css) với định dạng cho `#root-view` và `header.hero`.
  - Thực thi kiểm thử thực tế trên Node.js môi trường DOM mô phỏng: Toàn bộ 5 test case đều chạy và **PASS 100%**.
  - Tuân thủ: Đã thực sự chạy kiểm thử trước khi kết luận, không tự commit.
- **Kết quả**: Tạo thành công [`test-runner.js`](./test-runner.js), bộ kiểm thử assertion đạt 100% Pass, giao diện sẵn sàng nghiệm thu trên Live Server.
