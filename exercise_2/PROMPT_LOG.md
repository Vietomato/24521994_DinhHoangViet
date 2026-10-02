# AI-Assisted Engineering Prompt Log

## Milestone: Exercise 2 (Enterprise Developer Portfolio)

### Session Metadata
- **Date**: 2026-10-02
- **Engineer**: Đinh Hoàng Việt (24521994)
- **Role Persona**: Enterprise Frontend Architect & Performance Engineer
- **Task Reference**: Decomposition Pipeline (`TASK_DECOMPOSITION.md`)

---

### Initial Prompt (Prompt đầu tiên tạo Exercise 2)

```text
[USER PROMPT]
Hãy viết cho tôi 1 đoạn mã html trong file index.html để tạo 1 porfolio:Enterprise Developer Portfolio
Yêu cầu: Thanh header, main và footer
Header là thanh chứa tên và vị trí công việc cùng với ảnh đại diện, và mục tiêu của bản thân, main là các nhóm thông tin cá nhân(trường học, ngày sinh, skills, projects, footer chứa thông tin liên hệ, bao gồm sđt và gmail).

Còn file css tạo màu xanh phối vs lại trắng, các thực thể trong bố cục html chạy ổn định, không bị lệch, hơn nữa màu sắc phải mang theo cặp thông qua biến CSS và không đc hardcode mã hex trong các rule, có cả dark-mode enginee khi ng dùng cần nhé

Phần hiệu năng với cls = 0, lcp < 2second khi test bằng chế độ devtool ở chế độ fast 3g
```

---

### Phân tích Yêu Cầu & Thẩm Định Kỹ Thuật (Engineering Analysis)

1. **Kiến trúc HTML5 Semantic**:
   - Khởi tạo đầy đủ các thẻ landmark chuẩn: `<header class="site-header">`, `<main class="site-main">`, `<footer class="site-footer">`.
   - Header tích hợp nút chuyển đổi giao diện `button#theme-toggle`, ảnh đại diện `<img fetchpriority="high" width="140" height="140">` để triệt tiêu hiện tượng Cumulative Layout Shift (CLS = 0).
   - Main chia thành 3 section độc lập cấu trúc 2D Grid: Thông tin cá nhân & trường học (`<ul>`), kỹ năng chuyên môn (`.badge`), và dự án tiêu biểu (`article.project-item`).
   - Footer cung cấp kênh liên lạc truy cập nhanh với giao thức chuẩn `tel:` và `mailto:`.

2. **Hệ thống CSS Tokens & Design Contract**:
   - Phối màu chuẩn Enterprise Blue & White.
   - Toàn bộ bảng màu được định nghĩa theo cặp trong `:root` và `[data-theme="dark"]` (`--bg-primary`, `--bg-surface`, `--text-primary`, `--primary`,...).
   - **Tuyệt đối không hardcode mã hex `#...`** trong bất kỳ rule nào ngoài khối token.
   - Tương phản đạt chuẩn **WCAG 2.2 AA** ($\ge 4.5:1$).

3. **Dark Mode Engine (`app.js`)**:
   - Tuân thủ Contract-first: lưu trữ trạng thái chặt chẽ qua key `localStorage.getItem('theme')`.
   - Script khởi tạo sớm trong `<head>` triệt tiêu triệt để hiện tượng FOUC (Flash of Unstyled Content).
   - Zero console errors khi chuyển đổi theme.
   - Hỗ trợ đầy đủ tương tác bàn phím (Tab, Enter, Space).

4. **Tối ưu Hiệu Năng Core Web Vitals (DevTools Fast 3G)**:
   - **CLS = 0**: Đặt kích thước cứng `width`, `height`, `aspect-ratio: 1/1` cho avatar và container.
   - **LCP < 2.0s**: Sử dụng avatar inline vector siêu nhẹ, font hệ thống (`system-ui`) không chặn render đường truyền chậm.
