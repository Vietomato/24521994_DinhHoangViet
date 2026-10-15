[USER PROMPT]
I. Prompt 1
Bạn hãy đóng vai trò là một Enterprise Frontend Architect & Web Performance Engineer. Hãy thiết kế và hiện thực hóa dự án "Enterprise Developer Portfolio" theo đúng Quy trình phân rã công việc (Task Decomposition Pipeline) và ma trận tiêu chuẩn nghiệm thu sau:

1. Dựa vào yêu cầu phân rã công việc để thực hiện các tác vụ con T-02A, T-02B, T-02C:
   - SUB-TASK T-02A (Tokens & Reset): Thiết lập universal reset (box-sizing: border-box) và hệ thống Design Tokens bằng biến CSS (CSS Variables) ghép cặp chặt chẽ giữa Light mode (xanh dương phối trắng) và Dark mode. Đảm bảo tỷ lệ tương phản WCAG 2.2 AA (>= 4.5:1) và TUYỆT ĐỐI không hardcode bất kỳ mã màu hex (#...) nào trong các rule CSS bên dưới khối token.
   - SUB-TASK T-02B (2D Grid Layout): Xây dựng bố cục HTML5 ngữ nghĩa (header, main, footer) bằng hệ thống lưới 2D CSS Grid co giãn linh hoạt, hiển thị sắc nét trên thiết bị di động 375px (zero horizontal scroll).
   - SUB-TASK T-02C (Theme Engine): Xây dựng cơ chế chuyển đổi Dark/Light mode bằng Vanilla JS. Trạng thái giao diện phải được lưu vết nghiêm ngặt qua localStorage key 'theme', không sinh bất kỳ lỗi console nào khi toggle và hỗ trợ đầy đủ luồng phím điều hướng (Tab & Enter flow).

2. Đảm bảo ngân sách hiệu năng (Performance Budget):
   - CLS = 0 (Cumulative Layout Shift): Khai báo kích thước hiển thị cố định và aspect-ratio cho ảnh đại diện/khối nội dung để chống giật layout.
   - LCP < 2.0s khi test với Chrome DevTools ở chế độ Fast 3G: Ưu tiên tài nguyên quan trọng, sử dụng font hệ thống (system-ui) để tối ưu thời gian dựng trang ban đầu.




