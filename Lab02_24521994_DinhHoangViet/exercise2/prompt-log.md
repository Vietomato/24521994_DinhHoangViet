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
- Commit thực tế: `72757d8 feat(state): implement stateStore and resetCursor engine` (do người dùng thực hiện sau khi nghiệm thu kiểm thử).

---

## P003 — Milestone 2: reactive useState dispatcher

Ngày: 2026-10-17 (Asia/Saigon).

### Prompt nguyên văn

```text
Thực hiện milestone 2 trên code hiện tại.

Triển khai custom useState(initialValue) trả về [value, setter].

Yêu cầu:
- Mỗi lần gọi useState dùng một slot theo cursor.
- Chỉ khởi tạo initialValue khi slot chưa tồn tại.
- Setter phải capture đúng slot của chính nó.
- Hỗ trợ setter(newValue) và setter(previous => next).
- Setter cập nhật state rồi kích hoạt render lại.
- Reset cursor trước mỗi render.
- Hai state tasks và filter phải hoạt động độc lập.
- Export useState và renderApp từ reactive-engine.js.
- Không dùng React.

Tạo cách kiểm tra tối thiểu cho:
1. State tồn tại sau render lại.
2. Cập nhật tasks không làm thay đổi filter.
3. Functional updater hoạt động.
4. Setter của lần render cũ vẫn cập nhật đúng slot.

Cập nhật tài liệu và prompt-log theo kết quả thực tế.
Liệt kê các file cần stage, chưa triển khai milestone 3.
```

### Yêu cầu

1. Đọc `rule.md` và `task-decomposition.md`.
2. Triển khai custom hook `useState(initialValue)` trả về `[value, setter]`.
3. Quản lý slot độc lập theo `cursor`, chỉ nạp `initialValue` khi slot chưa tồn tại.
4. Setter capture cố định chỉ số `slotIndex` trong closure của lần gọi hook, không phụ thuộc vào cursor lúc chạy.
5. Setter hỗ trợ cả giá trị trực tiếp và updater function `setter(prev => next)`.
6. Setter cập nhật `stateStore` trước khi kích hoạt `dispatchRender()`.
7. `dispatchRender()` tự động gọi `resetCursor()` trước khi thực thi component render.
8. Hai state `tasks` và `filter` hoạt động độc lập, không ảnh hưởng lẫn nhau.
9. Export trực tiếp `useState` và `renderApp` từ `reactive-engine.js`.
10. Tích hợp chính sách `Object.is` tránh render thừa khi state không đổi.
11. Không dùng React hay thư viện bên ngoài.
12. Viết bộ kiểm thử độc lập xác nhận 4 yêu cầu kiểm tra cốt lõi và các trường hợp biên.
13. Cập nhật `task-decomposition.md` và `prompt-log.md`.
14. Liệt kê các file cần stage, dừng lại không tự commit và chưa triển khai Milestone 3.

### File thay đổi

| File | Thay đổi |
| --- | --- |
| `reactive-engine.js` | Mở rộng: Triển khai `useState`, `dispatchRender`, `renderApp`, `onRender`, kết nối render engine từ `exercise1/mini-react.js`, export trực tiếp `useState` và `renderApp`. |
| `test-milestone2.js` | Tạo mới: Bộ kiểm thử độc lập 7 ca thử nghiệm với 31 assertions cho Milestone 2. |
| `task-decomposition.md` | Cập nhật commit Milestone 1 (`72757d8`), đánh dấu checklist và kết quả kiểm tra Passed cho Milestone 2. |
| `prompt-log.md` | Cập nhật commit hash P002 và bổ sung nhật ký chi tiết P003. |

### Kết quả kiểm tra

Chạy lệnh kiểm thử tự động: `node test-milestone2.js`
Kết quả: 31/31 assertions đạt (**Passed**), cụ thể:
1. `Test 1 (State tồn tại sau render lại)`: Giá trị ban đầu = 10, sau khi gọi setter cập nhật = 25 và tự kích hoạt re-render. Các lần re-render tiếp theo không bị reset về 10.
2. `Test 2 (Cập nhật tasks không làm thay đổi filter)`: Thêm task mới vào slot 0 (`tasks`), slot 1 (`filter`) vẫn giữ nguyên `'all'`. Cập nhật `filter` sang `'completed'`, `tasks` vẫn giữ nguyên 3 phần tử. Hai slot hoàn toàn độc lập.
3. `Test 3 (Functional updater)`: Hai functional updater liên tiếp `setCount(prev => prev + 5)` và `setCount(prev => prev + 3)` đều nhận đúng state mới nhất, kết quả = 8.
4. `Test 4 (Setter của lần render cũ)`: Setter được lưu lại từ render lượt 1 vẫn cập nhật chính xác vào slot 0 và slot 1 mà nó đã capture, không bị lẫn slot dù đã qua nhiều chu kỳ render.
5. `Test 5 (Bảo toàn falsy values)`: Các giá trị `false`, `0`, `""`, `null`, `undefined` được bảo toàn nguyên vẹn qua các chu kỳ re-render.
6. `Test 6 (Chính sách Object.is)`: Gọi setter với giá trị giống hệt giá trị hiện tại không kích hoạt re-render thừa. Chỉ kích hoạt khi giá trị thực sự thay đổi.
7. `Test 7 (Export trực tiếp useState và renderApp)`: Instance mặc định xuất trực tiếp `useState` và `renderApp` hoạt động chính xác và tự động cập nhật UI.

Ngoài ra, chạy lại `node test-milestone1.js` đạt 27/27 assertions, đảm bảo không có hồi quy mã nguồn.

### Commit liên quan

- Commit bắt buộc theo kế hoạch: `feat(state): implement reactive useState dispatcher`
- Commit thực tế: `2866b8f feat(state): implement reactive useState dispatcher` (do người dùng thực hiện sau khi nghiệm thu kiểm thử).

---

## P004 — Milestone 3: root event delegation

Ngày: 2026-10-17 (Asia/Saigon).

### Prompt nguyên văn

```text
Thực hiện milestone 3: tích hợp root event delegation vào renderer.

Yêu cầu:
- Với các tương tác hiện tại, chỉ đăng ký một native listener
  cho mỗi loại sự kiện cần dùng tại root.
- Không gắn native event listener hoặc inline HTML handler
  trực tiếp lên button và các phần tử con.
- Renderer lưu và cập nhật handler để root dispatcher gọi được.
- Khi click span bên trong button vẫn tìm được handler của button.
- Render lại nhiều lần không tạo listener trùng.
- Không gọi handler cũ của node đã bị thay thế.

Cung cấp cách kiểm tra bằng DevTools:
- Listener được gắn tại root.
- Button và span con không có native listener trực tiếp.
- Một click chỉ gây một lần cập nhật sau nhiều lần render.

Cập nhật task-decomposition.md và prompt-log.md.
Liệt kê các file cần stage và dừng sau milestone này.
```

### Yêu cầu

1. Đọc lại `rule.md` và `task-decomposition.md`.
2. Tích hợp cơ chế Root Event Delegation vào `reactive-engine.js`:
   - Chỉ đăng ký đúng 1 native listener cho mỗi loại sự kiện (click, input,...) tại root container.
   - Tuyệt đối không gắn `dom.addEventListener` hay thuộc tính inline `onclick` trực tiếp lên button và các phần tử con.
   - Renderer lưu và cập nhật handlers qua `WeakMap<Node, Handlers>`.
   - Dispatcher tại root duyệt ngược từ `event.target` lên root (event bubbling), đảm bảo click vào `<span>` lồng trong `<button>` vẫn kích hoạt chính xác handler của button.
   - Bắt buộc kiểm tra `rootContainer.contains(event.target)` để không gọi handler cũ của node đã bị thay thế hoặc gỡ khỏi DOM.
   - Re-render nhiều lần không nhân bản hoặc đăng ký trùng listener tại root.
3. Tạo test bench `index.html` và cung cấp quy trình kiểm tra cụ thể bằng DevTools.
4. Viết bộ kiểm thử độc lập `test-milestone3.js` với 19 assertions bao phủ toàn bộ các yêu cầu.
5. Cập nhật `task-decomposition.md` và `prompt-log.md`.
6. Liệt kê các file cần stage và dừng lại không tự ý commit, chưa triển khai Milestone 4.

### File thay đổi

| File | Thay đổi |
| --- | --- |
| `reactive-engine.js` | Tích hợp Root Event Delegation: `renderToDOM` delegation-aware lưu handler qua `WeakMap`, `dispatchRootEvent` mô phỏng bubbling và kiểm tra `contains`, `ensureRootListener` đăng ký duy nhất 1 lần tại root. |
| `test-milestone3.js` | Tạo mới: Bộ kiểm thử độc lập 4 ca thử nghiệm với 19 assertions cho Milestone 3. |
| `index.html` | Tạo mới: Trang test bench giao diện trực quan phục vụ kiểm tra DevTools (Elements panel, Event Listeners, Console). |
| `task-decomposition.md` | Cập nhật commit Milestone 2 (`2866b8f`), đánh dấu hoàn thành checklist và kết quả kiểm tra Passed cho Milestone 3. |
| `prompt-log.md` | Cập nhật commit hash P003 và bổ sung toàn bộ nhật ký chi tiết P004. |

### Kết quả kiểm tra

Chạy lệnh kiểm thử tự động: `node test-milestone3.js`
Kết quả: 19/19 assertions đạt (**Passed**), cụ thể:
1. `Test 1 (Không gắn native listener trực tiếp)`: Button và 2 thẻ span con có 0 native listener, không có thuộc tính inline `onclick`. Handler được lưu an toàn trong `WeakMap`.
2. `Test 2 (Chỉ 1 native listener tại root)`: Root chỉ có đúng 1 native click listener sau lần render đầu tiên và vẫn giữ nguyên đúng 1 listener sau 6 lần re-render liên tiếp.
3. `Test 3 (Click span bên trong button)`: Phát sự kiện click từ `<span>` con, dispatcher duyệt bubbling và kích hoạt thành công handler của `<button>`. `event.target` được bảo toàn.
4. `Test 4 (Không gọi handler cũ & 1 click = 1 update)`: Click vào node cũ đã bị detached không kích hoạt handler. Click vào node mới chỉ gây đúng 1 lần cập nhật state và re-render duy nhất.

Chạy kiểm tra toàn diện cả 3 milestone:
- `node test-milestone1.js`: 27/27 assertions đạt.
- `node test-milestone2.js`: 31/31 assertions đạt.
- `node test-milestone3.js`: 19/19 assertions đạt.

### Commit liên quan

- Commit bắt buộc theo kế hoạch: `feat(events): attach root event delegation listener`
- Trạng thái: Chưa commit (tuân thủ quy tắc không tự ý commit mã nguồn, cung cấp lệnh cho người dùng kiểm tra và tự thực thi).
- Danh sách file thực tế thuộc Milestone 3 cần stage:
  - `reactive-engine.js`
  - `test-milestone3.js`
  - `index.html`
  - `task-decomposition.md`
  - `prompt-log.md`



