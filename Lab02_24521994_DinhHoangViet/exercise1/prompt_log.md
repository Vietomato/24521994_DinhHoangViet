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
