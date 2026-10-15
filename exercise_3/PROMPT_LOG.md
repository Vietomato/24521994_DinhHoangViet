[USER PROMPT]
Tiếp nối sau Exercise 2, chúng ta đã tạo dựng được một trang CV khá hoàn chỉnh. Bây giờ chuyển sang Exercise 3: "Component Architecture & State Modeling".

Bạn hãy đóng vai trò là một Full Stack Developer giàu kinh nghiệm, giải thích và hướng dẫn tôi mở rộng mã nguồn hiện tại theo kiến trúc thành phần (Modular Component Architecture) và mô hình hóa trạng thái (State Modeling). Tôi dự kiến phân rã và xây dựng các thành phần như sau:

1. Hero Section: Ảnh avatar độ phân giải cao (khai báo kích thước rõ ràng width/height để chống giật layout CLS), tiêu đề nghề nghiệp cùng đoạn pitch/giới thiệu ngắn và nút kêu gọi hành động (CTA).
2. Theme Switcher: Nút bấm đảm bảo khả năng tiếp cận (Accessibility), sử dụng thuộc tính aria-pressed và thay đổi biểu tượng động (mặt trăng/mặt trời) theo trạng thái isDarkMode.
3. Skills Matrix: Các huy hiệu kỹ năng (badges) được phân loại theo nhóm (Frontend, Backend, Database) và sắp xếp gọn gàng bằng CSS Grid.
4. Project Cards: Các khối dự án độc lập dùng thẻ ngữ nghĩa <article>, có gắn thuộc tính data-category, tiêu đề, thẻ công nghệ, mô tả và liên kết mã nguồn chuẩn aria-label.
5. Contact Form: Biểu mẫu liên hệ tích hợp kiểm tra dữ liệu hợp lệ phía client (HTML5 validation), đồng thời quản lý vòng đời trạng thái gửi biểu mẫu (State Modeling: idle -> submitting -> success / error) bằng Vanilla JavaScript thuần.

Lưu ý: Tiếp tục sử dụng thuần HTML5, CSS3 và Vanilla JS (không dùng React, Vue hay thư viện bên thứ 3).
```

