# Reactive State Machine & Delegation Hub — Rules

## Phạm vi và quy trình

- Dùng JavaScript thuần; tự xây dựng custom `useState` bằng closure. Không dùng React hoặc thư viện state thay thế phần bài tập.
- Mỗi yêu cầu chỉ triển khai milestone được người dùng chỉ định. Bước chuẩn bị chỉ tạo `rule.md`, `task-decomposition.md`, `prompt-log.md`; chưa viết code ứng dụng.
- Trước khi sửa code: đọc hai file `rule.md`, `task-decomposition.md`, xem cấu trúc project, `git status` và diff liên quan.
- Nếu có render engine từ bài trước, đọc và tận dụng nó; không tự thay thế trước khi hiểu cách hoạt động. Giữ nguyên tên và cấu trúc file phù hợp với project thực tế.
- Không ghi đè, reset, discard hoặc stage các thay đổi ngoài phạm vi. Nếu nội dung đang sửa xung đột với yêu cầu, giữ lại và báo rõ.
- Không tự `git init`, commit, push, amend hoặc thay đổi lịch sử Git. Chỉ cung cấp lệnh commit sau khi nêu cách kiểm tra; người dùng kiểm tra và tự chạy.
- Sau mỗi yêu cầu, bổ sung `prompt-log.md` với prompt nguyên văn, yêu cầu, file thực tế thay đổi, kết quả kiểm tra và commit liên quan. Không sửa lịch sử để tạo cảm giác đã thực hiện công việc chưa làm.

## Hợp đồng kỹ thuật

- Luồng duy nhất: `user event -> setter -> state update -> render -> UI`.
- `stateStore` và cursor nằm trong closure; state tồn tại qua các lần render. `resetCursor()` chỉ đưa cursor về 0, không xóa state.
- Mỗi lần gọi `useState` chiếm một slot theo thứ tự gọi. Chỉ khởi tạo slot chưa tồn tại; giữ đúng các giá trị `false`, `0`, `""`, `null`, `undefined` đã lưu.
- Gọi hook theo thứ tự ổn định, không đặt hook trong điều kiện hoặc vòng lặp có số lần thay đổi.
- Setter phải capture chỉ số slot của lần gọi hook, không dùng cursor hiện tại lúc setter chạy. Hỗ trợ giá trị trực tiếp và updater function nhận state mới nhất.
- Setter cập nhật store trước khi dispatch render. Một lần cập nhật state thực sự kích hoạt một lần render; có thể dùng `Object.is` để bỏ qua giá trị không đổi, nhưng phải ghi rõ và kiểm tra.
- Mỗi lượt render phải reset cursor trước khi gọi hàm tạo UI; không reset store hoặc đăng ký lại listener trong render.
- Gắn delegation trên phần tử root ổn định, một listener cho mỗi loại event cần dùng. Không gắn listener riêng lên từng task/nút; không nhân bản listener sau render.
- Dùng action và task ID ổn định để phân phối event. Dùng `closest()` và kiểm tra target thuộc root để xử lý cả khi bấm vào phần tử con trong nút. Chọn event bubbling phù hợp.
- UI tối thiểu: thêm task, chuyển Active/Completed, và bộ lọc All/Active/Completed. Bỏ qua nội dung chỉ có khoảng trắng; hiển thị nội dung nhập như text, không thực thi HTML.
- Cập nhật task bằng array/object mới; danh sách lọc là dữ liệu dẫn xuất từ tasks và filter, không xóa dữ liệu khi chuyển bộ lọc.

## Kiểm tra và Git

- Chạy kiểm tra phù hợp milestone bằng công cụ sẵn có hoặc thao tác trình duyệt; không cài framework chỉ để kiểm tra bước tài liệu.
- Ghi lệnh/thao tác, kết quả quan sát thật và giới hạn. Chưa chạy thì ghi chính xác `Not run`; không tự ghi `Passed`.
- Chỉ tick checklist khi có bằng chứng hoàn thành. Không tạo ảnh minh chứng, test output, commit hash hoặc lịch sử giả.
- Trước mỗi commit do người dùng chạy: xem `git status`, `git diff`, chỉ `git add` các đường dẫn thực tế thuộc milestone, rồi xem `git diff --cached`. Không dùng `git add .` khi có thay đổi khác.
- Commit message phải giữ nguyên theo `task-decomposition.md`; một commit chỉ hoàn thành một milestone. Đường dẫn code sẽ được xác định khi có project thật, không dùng đường dẫn giả để stage.

## Tình trạng lúc chuẩn bị

- Workspace: `/workspace/scratch/758127e3be6b`.
- Chưa có file project để đọc hoặc render engine để tái sử dụng.
- `git status --short --branch` trả về exit code 128: `fatal: not a git repository (or any of the parent directories): .git`.
- Chưa thể kiểm tra thay đổi Git, nhánh hay lịch sử. Trước milestone 1 cần có đúng thư mục project; chưa có căn cứ để triển khai code tại workspace này.


---

## Quy tắc riêng cho Exercise 3 (Resilient State Machine & Skeleton Loader)

1. **4 Trạng thái độc quyền (4-State Finite Machine)**:
   - State của component `DataFeed` chỉ có đúng 4 trạng thái: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`.
   - Không sử dụng cờ boolean phân tán (như `isLoading && isError`).
   - Định nghĩa bằng object đóng băng tương đương enum:
     ```javascript
     export const DataState = Object.freeze({
       IDLE: "IDLE",
       LOADING: "LOADING",
       SUCCESS: "SUCCESS",
       ERROR: "ERROR"
     });
     ```
2. **Hợp đồng giao diện 4 trạng thái (1:1 UI Mapping)**:
   - `IDLE`: Hướng dẫn người dùng và cung cấp nút bấm bắt đầu tải dữ liệu.
   - `LOADING`: Hiển thị khung xương (Skeleton Loader) có animation CSS dạng pulse, kích thước cố định để đạt Zero CLS.
   - `SUCCESS`: Hiển thị danh sách dữ liệu thực tế bằng các thẻ ngữ nghĩa HTML5.
   - `ERROR`: Hiển thị thông báo sự cố thân thiện và nút "Retry Connection".
3. **Cơ chế chống Race Condition**:
   - Sử dụng sequence counter `requestIdCounter` cho từng lượt request.
   - Request cũ (về sau) tuyệt đối không được ghi đè lên request mới hơn.
4. **Chuẩn ngôn ngữ**:
   - Sử dụng JavaScript chuẩn với chú thích JSDoc (`@typedef`, `@param`, `@returns`).
   - Không chuyển đổi toàn bộ project sang TypeScript.
