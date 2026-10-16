# Prompt log

Mỗi yêu cầu là một mục riêng. Giữ nguyên văn prompt; ghi file thực tế thay đổi, kiểm tra đã chạy và commit thực tế. Kiểm tra chưa chạy ghi `Not run`. Không tạo kết quả, ảnh hoặc hash giả.

## P001 — Chuẩn bị tài liệu

Ngày: 2026-10-16 (Asia/Saigon).

### Prompt nguyên văn

```text
Tôi cần xây dựng  Reactive State Machine & Delegation Hub.

Mục tiêu:
- Tự viết custom useState bằng JavaScript closure.
- Xây dựng Task Manager cập nhật giao diện ngay khi state thay đổi.
- Có bộ lọc All, Active, Completed.
- Tích hợp event delegation tại phần tử root.
- Luồng dữ liệu một chiều:
  user event -> setter -> state update -> render -> UI.
- Có lịch sử Git với các commit nhỏ, mỗi commit hoàn thành một nhiệm vụ.

Trước tiên hãy đọc cấu trúc project và git status.
Nếu đã có render engine từ bài trước, hãy tận dụng nó.
Không ghi đè hoặc reset các thay đổi hiện có.
Không dùng React hay thư viện state để thay thế phần cần tự xây dựng.

Ở bước này chỉ tạo 3 file:
1. rule.md: các quy tắc triển khai và kiểm tra.
2. task-decomposition.md: chia thành 4 milestone theo thứ tự bên dưới,
   có checklist và tiêu chí nghiệm thu.
3. prompt-log.md: ghi nguyên văn prompt hiện tại; mỗi mục có yêu cầu,
   file thay đổi, kết quả kiểm tra và commit liên quan.
   Chưa kiểm tra thì ghi "Not run", không tự ghi Passed.

Bốn milestone và commit message bắt buộc:
1. feat(state): implement stateStore and resetCursor engine
2. feat(state): implement reactive useState dispatcher
3. feat(events): attach root event delegation listener
4. feat(ui): assemble reactive todo application

Quy tắc:
- Mỗi lần chỉ triển khai milestone tôi yêu cầu.
- Đọc rule.md và task-decomposition.md trước khi sửa code.
- Cập nhật prompt-log.md sau mỗi yêu cầu.
- Không tự tạo commit; cung cấp lệnh để tôi chạy sau khi kiểm tra.
- Không tạo ảnh minh chứng hoặc kết quả kiểm tra giả.

Chưa viết code ứng dụng ở bước này.
```

### Yêu cầu

Đọc cấu trúc project/Git trước; chỉ tạo ba file tài liệu quy tắc, kế hoạch bốn milestone và log này. Chưa triển khai ứng dụng, chưa tạo commit.

### File thay đổi

| File | Thay đổi |
| --- | --- |
| `rule.md` | Tạo mới: phạm vi, hợp đồng state/render/delegation, kiểm tra và Git. |
| `task-decomposition.md` | Tạo mới: đúng bốn milestone, checklist, nghiệm thu và commit message bắt buộc. |
| `prompt-log.md` | Tạo mới: prompt nguyên văn, yêu cầu, file thay đổi, kết quả và commit liên quan. |

### Kết quả kiểm tra

| Kiểm tra | Kết quả thực tế |
| --- | --- |
| `pwd` và liệt kê file project bằng `rg --files` (loại thư mục dependency/build) | Đã chạy: workspace `/workspace/scratch/758127e3be6b`; không tìm thấy file project, `rg` exit code 1. |
| Liệt kê thư mục hiện tại | Đã chạy: chưa có file project trước khi tạo tài liệu. |
| `git status --short --branch` | Đã chạy, exit code 128: `fatal: not a git repository (or any of the parent directories): .git`. |
| Đọc/tái sử dụng render engine cũ | Not run — chưa có source project. |
| Kiểm tra chức năng state/render/delegation/Task Manager | Not run — chưa viết code ứng dụng. |
| Build, lint, automated tests, browser tests | Not run — chưa có project/cấu hình để chạy. |

### Commit liên quan

- Commit thực tế: chưa tạo; không có hash.
- Đây là bước chuẩn bị, chưa hoàn thành milestone nào; chưa sử dụng bốn commit message triển khai.
- Chưa cung cấp lệnh stage code cụ thể vì chưa xác định đường dẫn project. Sau từng milestone sẽ cung cấp lệnh theo file đã sửa thực tế để người dùng kiểm tra và tự commit.
- Cần có source project/đường dẫn đúng trước khi thực hiện milestone 1; không khởi tạo Git thay người dùng.

---

## P002 — Milestone 1: stateStore và resetCursor engine

Ngày: 2026-10-17 (Asia/Saigon).

### Prompt nguyên văn

```text
Đọc rule.md và task-decomposition.md, thực hiện milestone 1.

Triển khai stateStore và cursor trong reactive-engine.js
hoặc module phù hợp với cấu trúc hiện có.

Yêu cầu:
- State được lưu và giữ lại giữa các lần render.
- resetCursor() đưa cursor về 0 trước mỗi lần render,
  không xóa dữ liệu state.
- Đóng gói dữ liệu nội bộ bằng closure.
- Chuẩn bị nền tảng cho nhiều useState hoạt động độc lập.
- Chưa triển khai dispatcher, event delegation hoặc UI hoàn chỉnh.

Cung cấp cách kiểm tra ngắn để xác nhận:
resetCursor không làm mất state, và các slot state giữ đúng thứ tự.

Cập nhật task-decomposition.md và prompt-log.md theo kết quả thực tế.
Liệt kê chính xác các file cần git add cho milestone này.
Dừng sau milestone 1.

ghi nhớ vào prompt-log
```

### Yêu cầu

1. Đọc lại `rule.md` và `task-decomposition.md`.
2. Triển khai `reactive-engine.js` với `stateStore` và `cursor` được bảo vệ hoàn toàn bên trong closure.
3. Cung cấp hàm `resetCursor()` đưa cursor về 0 trước mỗi lần render, giữ nguyên toàn bộ mảng state.
4. Cơ chế slot lưu trữ độc lập theo thứ tự gọi hook, hỗ trợ đầy đủ các kiểu dữ liệu falsy (`false`, `0`, `""`, `null`, `undefined`).
5. Không triển khai dispatcher, event delegation hoặc UI hoàn chỉnh tại milestone này.
6. Viết bộ kiểm tra tự động xác nhận `resetCursor()` không làm mất state và các slot giữ đúng thứ tự.
7. Cập nhật `task-decomposition.md` và `prompt-log.md`.
8. Liệt kê chính xác các file cần `git add` và cung cấp lệnh commit tương ứng; dừng lại không tự commit.

### File thay đổi

| File | Thay đổi |
| --- | --- |
| `reactive-engine.js` | Tạo mới: `createStateEngine()`, `resetCursor()`, `getCursor()`, `allocateSlot()`, `setSlotValue()`, `getSlotValue()`, `getStoreSnapshot()`, `getSlotCount()`. |
| `test-milestone1.js` | Tạo mới: Bộ kiểm thử độc lập 6 ca thử nghiệm, 27 assertions cho Milestone 1. |
| `task-decomposition.md` | Cập nhật checklist Milestone 1 và ghi nhận kết quả kiểm tra Passed. |
| `prompt-log.md` | Bổ sung mục P002 ghi lại toàn bộ tiến trình Milestone 1. |

### Kết quả kiểm tra

Chạy lệnh kiểm thử tự động: `node test-milestone1.js`
Kết quả: 27/27 assertions đạt (**Passed**), cụ thể:
1. `Test 1 (Khởi tạo closure)`: `cursor === 0`, `stateStore` rỗng ban đầu.
2. `Test 2 (Cấp phát slot tuần tự)`: Cấp phát thành công 6 slot tuần tự, lưu trữ chính xác các giá trị bao gồm cả falsy (`0`, `false`, `""`, `null`, `undefined`), cursor tăng đúng lên 6.
3. `Test 3 (resetCursor)`: `cursor` quay về 0, số lượng và nội dung các slot trong store được giữ nguyên vẹn.
4. `Test 4 (Mô phỏng re-render)`: Duyệt lại các slot với giá trị khởi tạo mới, xác nhận store không bị ghi đè, giá trị cũ được bảo toàn tuyệt đối.
5. `Test 5 (Cập nhật state & resetCursor)`: Gọi `setSlotValue` bằng giá trị trực tiếp và updater function, qua nhiều lần `resetCursor()` các giá trị mới cập nhật vẫn được giữ vững.
6. `Test 6 (Tính cô lập của factory)`: `createStateEngine()` tạo ra các instance có closure hoàn toàn độc lập, thay đổi trên engine này không làm ảnh hưởng engine khác.

### Commit liên quan

- Commit bắt buộc theo kế hoạch: `feat(state): implement stateStore and resetCursor engine`
- Trạng thái: Chưa commit (tuân thủ quy tắc không tự ý commit mã nguồn, cung cấp lệnh cho người dùng kiểm tra và tự thực thi).
- Danh sách file thực tế thuộc Milestone 1 cần stage:
  - `reactive-engine.js`
  - `test-milestone1.js`
  - `task-decomposition.md`
  - `prompt-log.md`

