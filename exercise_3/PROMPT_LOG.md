# AI-Assisted Engineering Prompt Log

## Milestone: Exercise 3 (Component Architecture & State Modeling)

### Session Metadata
- **Date**: 2026-10-02
- **Engineer**: Đinh Hoàng Việt (MSSV: 24521994)
- **Role Persona**: Senior Software Engineer & Web Development Instructor
- **Course**: Web Application Development Lab (Lab 01)
- **Target Exercise**: Exercise 3 - Component Architecture & State Modeling

---

### Initial Prompt (Yêu cầu đề bài Exercise 3)

```text
[USER PROMPT]
You are a senior Software Engineer and Web Development instructor.

I am working on Exercise 3: "Component Architecture & State Modeling"
for a Web Application Development lab.

I already have a portfolio website from Exercise 2.
Your task is to MODIFY and EXTEND my existing Exercise 2 code,
not completely redesign it from scratch.

IMPORTANT:
- Use only HTML, CSS, and Vanilla JavaScript.
- Do NOT use React, Vue, Angular, Bootstrap, Tailwind, or other frameworks.
- Keep the existing portfolio content and visual identity where possible.
- Write clean, beginner-friendly code because I need to explain it to my lecturer.
- Do not add unnecessary libraries or dependencies.

The Exercise 3 requirements are:
1. MODULAR COMPONENT ARCHITECTURE: Header, Hero, Theme Switcher, Skills Matrix, Project Cards, Contact Form, Footer.
2. HERO SECTION: Profile image (width, height, alt), Name, Headline, Pitch, CTA button.
3. THEME SWITCHER: <button>, aria-pressed, dynamic icon, JavaScript state (isDarkMode), CSS variables.
4. SKILLS MATRIX: CSS Grid, grouped into Frontend, Backend, Database with skill badges.
5. PROJECT CARDS: At least 3 cards with <article>, header, p, footer, data-category.
6. CONTACT FORM: Name, Email, Message, Submit button, native HTML validation (required, type="email", minlength).
7. FORM STATE MODELING: JavaScript state { name, email, message, status: "idle" | "submitting" | "success" | "error" }.
8. ACCESSIBILITY: WCAG contrast, proper <label>, aria-pressed, keyboard navigation.
9. RESPONSIVE DESIGN: Desktop, Tablet, Mobile with CSS Grid & Flexbox.
10. CODE ORGANIZATION: Exactly portfolio.html, style.css, script.js, images/avatar.png.
```

---

### Phân tích Kỹ thuật & Hiện thực (Technical Implementation Analysis)

1. **Kiến trúc thành phần ngữ nghĩa (Semantic Component Architecture)**:
   - Module hóa toàn bộ trang thành 7 components độc lập:
     - Header / Navigation: `<header class="site-header">`, `<nav class="site-nav">`.
     - Hero Section: `<section class="hero-section">` chứa `<img>` (`width="160"`, `height="160"`, `fetchpriority="high"`).
     - Theme Switcher: `<button id="theme-toggle" aria-pressed="false">` tích hợp icon động.
     - Skills Matrix: `<section class="skills-section">` dùng CSS Grid chia 3 cột danh mục (Frontend, Backend, Database).
     - Project Cards: 3 thẻ `<article class="project-card" data-category="...">` chuẩn W3C `<header>`, `<p>`, `<footer>`.
     - Contact Form: `<form id="contact-form" novalidate>` với native HTML5 validation constraints.
     - Footer: `<footer class="site-footer">` chứa kênh liên hệ nhanh và bản quyền.

2. **Mô hình State Theme Switcher (`script.js`)**:
   - Quản lý trạng thái logic: `let isDarkMode = true/false;`.
   - Cơ chế Single Source of Truth thông qua hàm `renderThemeUI()`:
     - Cập nhật thuộc tính `data-theme` trên `<html>`.
     - Cập nhật chuẩn tiếp cận `aria-pressed="true|false"` trên toggle button.
     - Đổi icon động giữa 🌙 (Tối) và ☀️ (Sáng).
     - Lưu trữ liên tục vào `localStorage` với key `'theme'`.

3. **Mô hình Form State Machine (`script.js`)**:
   - Đối tượng trạng thái chuẩn:
     ```javascript
     const formState = {
       name: '',
       email: '',
       message: '',
       status: 'idle' // idle | submitting | success | error
     };
     ```
   - Hàm `renderFormStateUI()` kiểm soát UI tương ứng:
     - `idle`: Form sẵn sàng, nút Submit enabled ("Gửi tin nhắn").
     - `submitting`: Disable nút Submit, đổi text thành "Đang gửi...", hiển thị banner thông báo trạng thái `aria-live="polite"`.
     - `success`: Hiển thị thông điệp cảm ơn cá nhân hóa, tự động reset form sau 1.5s delay giả lập mạng, quay về `idle`.
     - `error`: Hiển thị cảnh báo và các field validation messages.

4. **Bố cục Đáp ứng & Trợ năng (Responsive & Accessibility)**:
   - Sử dụng CSS Grid `repeat(auto-fit, minmax(280px, 1fr))` cho Skills Matrix và Project Grid.
   - Thẻ `<label for="...">` liên kết chặt chẽ với từng trường `<input>`, `<textarea>`.
   - Hỗ trợ đầy đủ tương tác bàn phím (phím `Tab`, `Enter`, `Space`) cho theme toggle button và form controls.

---

### Danh mục Ảnh chụp Kết quả Thực thi (`Screenshot_of_Results/`)

Các kết quả thực thi kiểm thử giao diện và mô hình trạng thái đã được chụp và lưu trữ tự động:

| STT | Tên tệp ảnh | Nội dung kiểm thử |
|---|---|---|
| 1 | `desktop_light_mode.png` | Toàn bộ giao diện Desktop ở chế độ Light Theme (chế độ sáng) |
| 2 | `desktop_dark_mode.png` | Toàn bộ giao diện Desktop ở chế độ Dark Theme (chế độ tối) |
| 3 | `hero_section_desktop.png` | Cận cảnh thành phần Hero Section, avatar và các nút Call-To-Action |
| 4 | `form_state_submitting.png` | Trạng thái `status = "submitting"`: Nút gửi bị vô hiệu hóa, thông báo "Đang gửi..." |
| 5 | `form_state_success.png` | Trạng thái `status = "success"`: Thông báo gửi thành công và cá nhân hóa lời cảm ơn |
| 6 | `tablet_responsive_768px.png` | Kiểm thử giao diện tương thích trên thiết bị Tablet (độ rộng 768px) |
| 7 | `mobile_responsive_375px.png` | Kiểm thử giao diện tương thích trên thiết bị Mobile (độ rộng 375px) |
