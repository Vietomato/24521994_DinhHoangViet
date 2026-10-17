# Prompt Log — Exercise 3

Mỗi yêu cầu là một mục riêng biệt. Lưu trữ nguyên văn prompt; ghi nhận các file thực tế thay đổi, kết quả kiểm tra thực tế và các commit tương ứng.  
*Quy tắc đạo đức kỹ thuật: Chưa kiểm tra thì ghi chính xác `Not run`, không tự ghi Passed; không tạo kết quả, ảnh hoặc commit hash giả mạo.*

---

## Bối Cảnh & Kế Thừa Từ Exercise 2

Exercise 3 được xây dựng dựa trên nền tảng kỹ thuật đã hoàn thành ở Exercise 2:
- Engine VNode (`mini-react.js` từ Exercise 1).
- Closure-based State Store & Con trỏ `cursor` với `resetCursor()`.
- Reactive `useState` Dispatcher tự động re-render.
- Root Event Delegation Hub với ánh xạ `WeakMap`.

---

## Ex3 — P001: Resilient State Machine & Skeleton Loader (Chuẩn Bị Tài Liệu)

Ngày ghi nhận: 2026-10-17 (Asia/Saigon).

### Prompt Nguyên Văn

```text
Tôi cần làm về Resilient State Machine & Skeleton Loader dựa file trên ex2.
Yêu cầu:
- Xây dựng component DataFeed tải dữ liệu bất đồng bộ.
- State chỉ có 4 trạng thái: IDLE, LOADING, SUCCESS, ERROR.
- IDLE: hướng dẫn người dùng bấm tải dữ liệu.
- LOADING: hiển thị skeleton có animation CSS dạng pulse.
- SUCCESS: hiển thị dữ liệu.
- ERROR: hiển thị thông báo dễ hiểu và nút "Retry Connection".
- Xử lý race condition: request cũ không được ghi đè request mới.
- Giao diện luôn tương ứng với trạng thái hiện tại.
Project là JavaScript,nên dùng object tương đương và JSDoc;
không chuyển toàn bộ project sang TypeScript chỉ vì bài này.

Trước tiên chỉ cập nhật tài liệu bằng tiếng Việt, encoding UTF-8:
1. rule.md: thêm quy tắc riêng cho Ex3.
2. task-decomposition.md: thêm kế hoạch Ex3 gồm:
   thiết kế state, tải dữ liệu và chống race condition,
   giao diện 4 trạng thái, kiểm tra và minh chứng.
3. prompt-log.md: ghi nguyên văn prompt này vào mục Ex3.

Giữ nội dung Ex2.
Chưa viết code ở bước này.
Không tự ghi kết quả Passed nếu chưa chạy kiểm tra.
Không tự commit.
```

### Phân Tích Yêu Cầu

1. **Khởi tạo tài liệu kỹ thuật cho Exercise 3**:
   - Dựa trên nền tảng các file của Exercise 2, giữ nguyên giá trị cốt lõi của Ex2.
   - Bổ sung quy tắc riêng cho Ex3 vào `rule.md`: 4 trạng thái độc quyền (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`), component `DataFeed`, cơ chế chống Race Condition, Zero CLS Skeleton Loader dạng pulse.
   - Bổ sung kế hoạch chi tiết vào `task-decomposition.md` chia thành 4 milestone có checklist và tiêu chí nghiệm thu.
   - Ghi nguyên văn prompt vào mục Ex3 trong `prompt-log.md`.
2. **Tuân thủ các ràng buộc nghiêm ngặt**:
   - Giữ nguyên project là JavaScript thuần + JSDoc, không chuyển sang TypeScript.
   - Chưa viết mã nguồn ứng dụng ở bước này.
   - Kết quả kiểm tra ghi nhận trung thực là `Not run`.
   - Không tự ý tạo Git commit.

### File Thay Đổi

| File | Hành động | Nội dung thay đổi |
| :--- | :--- | :--- |
| `rule.md` | Tạo mới (Ex3) | Kế thừa quy tắc Ex2, bổ sung quy tắc máy trạng thái 4 bước, hợp đồng giao diện 1:1, chống Race Condition bằng Sequence Counter, và chuẩn JSDoc. |
| `task-decomposition.md` | Tạo mới (Ex3) | Kế thừa kiến trúc Ex2, chia kế hoạch Ex3 thành 4 Milestone (`T-03A` đến `T-03D`) với checklist đầy đủ. |
| `prompt-log.md` | Tạo mới (Ex3) | Ghi nhận bối cảnh Ex2 và toàn bộ nội dung prompt nguyên văn P001 cùng các phân tích yêu cầu. |

### Kết Quả Kiểm Tra

- Trạng thái kiểm tra: **Not run** (Chưa viết mã nguồn và chưa chạy test runner ở bước chuẩn bị tài liệu).

### Commit Liên Quan

- Trạng thái: **Chưa tạo** (Tuân thủ nghiêm ngặt quy tắc không tự ý commit).

