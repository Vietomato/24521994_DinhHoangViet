# Task decomposition

Bước hiện tại chỉ chuẩn bị ba file tài liệu. Cả bốn milestone đều **chưa triển khai**, kiểm tra ứng dụng: **Not run**. Thực hiện lần lượt và chỉ khi người dùng yêu cầu milestone tương ứng. Đọc `rule.md` và file này trước mỗi lần sửa code.

Điều kiện bắt đầu milestone 1: có thư mục project thực tế; đọc cấu trúc, Git status/diff và render engine cũ nếu có. Workspace chuẩn bị hiện chưa có project và không phải Git repository. Các đường dẫn code được chốt sau khi đọc project, không tạo cấu trúc mới một cách suy đoán.

## Milestone 1 — stateStore và resetCursor

Commit bắt buộc: `feat(state): implement stateStore and resetCursor engine`

Checklist:

- [ ] Đọc project, Git status/diff và xác định render engine có thể tận dụng.
- [ ] Tạo state engine bằng closure chứa `stateStore` và cursor; giữ store nội bộ.
- [ ] Chuẩn bị cơ chế slot cho các hook; cung cấp `resetCursor()` chỉ reset cursor.
- [ ] Kiểm tra cursor quay về 0 và state không bị xóa qua nhiều lượt reset.
- [ ] Ghi prompt, file thay đổi và kiểm tra thật vào `prompt-log.md`.
- [ ] Cung cấp lệnh stage theo file thực tế và commit message bắt buộc để người dùng tự chạy.

Nghiệm thu: store tồn tại qua các lượt render mô phỏng; reset cursor không xóa hoặc tái khởi tạo state. Không triển khai dispatcher, delegation hoặc todo UI ở milestone này.

Kiểm tra: **Not run**. Commit thực tế: **Chưa tạo**.

## Milestone 2 — reactive useState dispatcher

Phụ thuộc: milestone 1 được nghiệm thu.

Commit bắt buộc: `feat(state): implement reactive useState dispatcher`

Checklist:

- [ ] Đọc lại hai file quy tắc/kế hoạch và Git status/diff.
- [ ] Triển khai `useState(initialValue)` trả về `[value, setter]` từ slot theo cursor.
- [ ] Chỉ khởi tạo slot mới; setter capture slot riêng và hỗ trợ updater function.
- [ ] Kết nối dispatcher với render engine hiện có hoặc render callback phù hợp; reset cursor trước mỗi render.
- [ ] Kiểm tra ít nhất hai slot độc lập, setter cũ sau render, falsy state và hai updater liên tiếp sử dụng giá trị mới nhất.
- [ ] Kiểm tra state thay đổi được render tự động, không cần gọi render từ handler; ghi nhận chính sách giá trị không đổi.
- [ ] Cập nhật prompt log và cung cấp lệnh commit theo file thực tế.

Nghiệm thu: setter cập nhật đúng slot qua nhiều lượt render; không mất state, không lẫn slot, không render trước khi cập nhật store. Chưa xây dựng todo UI hoặc delegation.

Kiểm tra: **Not run**. Commit thực tế: **Chưa tạo**.

## Milestone 3 — root event delegation

Phụ thuộc: milestone 2 được nghiệm thu.

Commit bắt buộc: `feat(events): attach root event delegation listener`

Checklist:

- [ ] Đọc lại hai file quy tắc/kế hoạch và Git status/diff.
- [ ] Xác định root ổn định; attach một lần cho mỗi loại event cần thiết bên ngoài render.
- [ ] Phân phối event qua action và task ID; tìm target bằng `closest()` và giới hạn trong root.
- [ ] Thiết kế handler nhận state mới nhất và gọi setter, không sửa DOM để cập nhật task.
- [ ] Kiểm tra phần tử được tạo động, bấm phần tử con trong nút, action không hợp lệ và event ngoài root.
- [ ] Kiểm tra sau nhiều lượt render một event chỉ gọi handler một lần; dùng fixture tối thiểu khi UI chưa được lắp ráp.
- [ ] Cập nhật prompt log và cung cấp lệnh commit theo file thực tế.

Nghiệm thu: delegation vẫn hoạt động khi thay nội dung bên trong root, không tạo listener trùng và không phụ thuộc listener trên từng task. Chưa lắp ráp ứng dụng todo hoàn chỉnh.

Kiểm tra: **Not run**. Commit thực tế: **Chưa tạo**.

## Milestone 4 — reactive todo application

Phụ thuộc: milestone 3 được nghiệm thu.

Commit bắt buộc: `feat(ui): assemble reactive todo application`

Checklist:

- [ ] Đọc lại hai file quy tắc/kế hoạch và Git status/diff.
- [ ] Lắp Task Manager từ state engine, dispatcher, render engine và delegation đã có.
- [ ] Thêm task với ID ổn định, trim nội dung và bỏ qua chuỗi rỗng.
- [ ] Chuyển trạng thái hoàn thành qua setter; giao diện cập nhật ngay.
- [ ] Thêm All, Active, Completed; hiển thị bộ lọc đang chọn và trạng thái danh sách rỗng.
- [ ] Dẫn xuất danh sách hiển thị từ tasks và filter, giữ dữ liệu khi đổi bộ lọc.
- [ ] Kiểm tra thêm hai task, hoàn thành một task: All có 2, Active có 1, Completed có 1; bỏ hoàn thành và kiểm tra lại.
- [ ] Kiểm tra thêm task trong Completed không hiện sai bộ lọc; đổi All vẫn thấy task mới; nội dung giống HTML hiển thị an toàn như text.
- [ ] Kiểm tra event lặp sau nhiều render không gây thao tác trùng; không có lỗi console trong các luồng đã chạy.
- [ ] Cập nhật prompt log với kết quả thật và cung cấp lệnh commit theo file thực tế.

Nghiệm thu: người dùng thêm và chuyển trạng thái task được; ba bộ lọc đúng; UI phản ánh ngay state mới theo `user event -> setter -> state update -> render -> UI`. Không dùng React/thư viện state.

Kiểm tra: **Not run**. Commit thực tế: **Chưa tạo**.

## Cách cung cấp lệnh Git sau mỗi milestone

Chỉ sau khi có project và thay đổi thực tế: nêu cách kiểm tra, liệt kê file thuộc milestone, rồi cung cấp lệnh `git status`, `git diff`, `git add` với từng đường dẫn cụ thể, `git diff --cached` và `git commit -m` với message tương ứng ở trên. Người dùng kiểm tra rồi tự chạy. Không tự đánh dấu đã commit khi chưa có xác nhận/hash thật. Bước tài liệu hiện tại chưa tạo commit và không dùng một trong bốn message triển khai cho công việc chưa làm.
