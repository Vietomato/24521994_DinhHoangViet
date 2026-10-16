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
