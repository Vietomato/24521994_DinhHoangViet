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

