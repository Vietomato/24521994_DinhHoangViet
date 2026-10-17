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



---

## Ex3 — P002: Triển Khai Logic DataFeed & Chống Race Condition

Ngày ghi nhận: 2026-10-17 (Asia/Saigon).

### Prompt Nguyên Văn

```text
Đọc rule.md và phần Ex3 trong task-decomposition.md.

Triển khai phần logic cho DataFeed:
- State duy nhất mô tả vòng đời tải dữ liệu:
  IDLE, LOADING, SUCCESS, ERROR.
- Không dùng nhiều boolean isLoading, isError, isSuccess độc lập.
- Chỉ SUCCESS có data; chỉ ERROR có error.
- Khi bắt đầu tải hoặc retry: chuyển sang LOADING.
- Thành công: chuyển sang SUCCESS.
- Thất bại: chuyển sang ERROR với thông báo dễ hiểu.

Tạo mock API cục bộ để chạy ổn định, không cần mạng:
- Chế độ thành công sau khoảng 1.5 giây.
- Chế độ thất bại sau khoảng 1.5 giây.
- Có thể cấu hình độ trễ và dữ liệu trả về để kiểm tra race condition.
- Không dùng lỗi ngẫu nhiên làm cách kiểm tra chính.

Chống race condition bằng request ID tăng dần hoặc cơ chế tương đương:
- Chỉ request mới nhất được cập nhật state.
- Áp dụng cho cả kết quả thành công và lỗi.
- Request ID phải tồn tại qua các lần render,
  không khởi tạo lại trong thân component mỗi lần render.
- Nếu dùng AbortController, mock API phải thực sự hỗ trợ signal.

Tận dụng custom useState của project.
Cập nhật prompt-log.md và checklist theo kết quả thực tế.
Chưa commit; bước sau sẽ hoàn thiện UI.
```

### Phân Tích & Hành Động Kỹ Thuật

1. **Khởi tạo module `data-feed-logic.js`**:
   - Định nghĩa enum `DataState = Object.freeze({ IDLE, LOADING, SUCCESS, ERROR })`.
   - Thiết lập cấu trúc state duy nhất: `{ status, data, error }`. Đảm bảo nguyên tắc:
     - `IDLE`: `data = null`, `error = null`.
     - `LOADING`: `data = null`, `error = null`.
     - `SUCCESS`: `data = result`, `error = null`.
     - `ERROR`: `data = null`, `error = message`.
   - Xây dựng `mockFetchData(options)`:
     - Giả lập độ trễ mặc định 1.5s (có thể cấu hình linh hoạt cho kiểm thử).
     - Hỗ trợ cờ `shouldFail` và thông báo lỗi tùy biến, không phụ thuộc vào ngẫu nhiên.
     - Lắng nghe và xử lý sự kiện `abort` của `AbortSignal` thật, ném `DOMException('The operation was aborted.', 'AbortError')`.
   - Xây dựng `createDataFeedController({ useState, fetcher })`:
     - Lưu trữ `latestRequestId = 0` và `activeAbortController` bên trong closure, đảm bảo không bị khởi tạo lại khi component re-render.
     - Tận dụng `useState` từ Exercise 2 (`../exercise2/reactive-engine.js`).
     - Khi `loadData()` được gọi: tăng `latestRequestId`, chuyển sang `LOADING`, khởi tạo `AbortController` mới để hủy request dở dang.
     - Sau khi fetch xong: kiểm tra `currentRequestId === latestRequestId`. Nếu không trùng (do request mới hơn đã được phát), toàn bộ kết quả (kể cả thành công hay lỗi) đều bị loại bỏ, ngăn chặn hoàn toàn Race Condition.
     - Cung cấp hàm `retry()` chuyển ngay sang `LOADING` và gửi request mới.
2. **Xây dựng bộ kiểm thử tự động `test-data-feed-logic.js`**:
   - Bao phủ 7 nhóm kiểm thử với 41 assertions độc lập:
     - Test 1: Kiểm tra 4 trạng thái độc quyền của `DataState`.
     - Test 2: Mock API chạy ổn định (Success, Failure, và AbortSignal).
     - Test 3: Vòng đời tải thành công (IDLE -> LOADING -> SUCCESS).
     - Test 4: Vòng đời tải lỗi và Retry (IDLE -> LOADING -> ERROR -> Retry -> SUCCESS).
     - Test 5: Chống Race Condition thành công (Request 1 chậm bị Request 2 nhanh ghi đè).
     - Test 6: Lỗi từ request cũ không làm hỏng state SUCCESS của request mới.
     - Test 7: Request ID bền vững qua nhiều chu kỳ render.
3. **Cập nhật tài liệu**:
   - Đánh dấu checklist Milestone 1 và Milestone 2 là `Passed` trong `task-decomposition.md`.
   - Ghi nhận chi tiết kết quả chạy kiểm thử vào `prompt-log.md`.
   - Giữ nguyên trạng thái chưa commit theo đúng yêu cầu.

### File Thực Tế Thay Đổi

| File | Hành động | Nội dung chi tiết |
| :--- | :--- | :--- |
| `data-feed-logic.js` | Tạo mới | Máy trạng thái 4 bước, mock API hỗ trợ signal, controller chống Race Condition với Request ID bền vững qua render. |
| `test-data-feed-logic.js` | Tạo mới | Bộ kiểm thử tự động độc lập 41 assertions bao phủ toàn diện các luồng logic và Race Condition. |
| `task-decomposition.md` | Cập nhật | Đánh dấu checklist và cập nhật kết quả kiểm thử Passed cho Milestone 1 và Milestone 2. |
| `prompt-log.md` | Cập nhật | Bổ sung mục P002 với nguyên văn prompt, phân tích kỹ thuật và kết quả kiểm thử thực tế. |

### Kết Quả Kiểm Tra Thực Tế

- Lệnh chạy kiểm thử: `node test-data-feed-logic.js`
- Kết quả quan sát: **Đã vượt qua 41/41 assertions (100% Passed)**, không có bất kỳ lỗi nào.
  - *Test 1*: 6/6 assertions đạt.
  - *Test 2*: 5/5 assertions đạt.
  - *Test 3*: 9/9 assertions đạt.
  - *Test 4*: 10/10 assertions đạt.
  - *Test 5 (Race Condition)*: 6/6 assertions đạt.
  - *Test 6 (Stale Error Rejection)*: 3/3 assertions đạt.
  - *Test 7 (Render Persistence)*: 2/2 assertions đạt.

### Commit Liên Quan

- Trạng thái: **Chưa commit** (Tuân thủ chỉ đạo: "Chưa commit; bước sau sẽ hoàn thiện UI").

---

## Ex3 — P003: Hoàn Thiện Giao Diện 4 Trạng Thái & Pulse Skeleton

Ngày ghi nhận: 2026-10-17 (Asia/Saigon).

### Prompt Nguyên Văn

```text
Tiếp tục hoàn thiện UI Ex3 trên phần logic vừa viết.

Tạo trang hoặc khu vực Ex3 riêng để mở được từ ứng dụng,
giữ các bài trước truy cập được.

Giao diện:
1. IDLE:
   - Hiển thị lời nhắc và nút "Load Data".
2. LOADING:
   - Hiển thị 4 skeleton card có CSS pulse animation.
   - Skeleton có bố cục gần giống card dữ liệu thật.
   - Có aria-busy và thông báo đang tải.
3. SUCCESS:
   - Hiển thị dữ liệu mock thành các card dễ đọc.
   - Có nút tải lại.
4. ERROR:
   - Hiển thị thông báo dễ hiểu, role="alert".
   - Có nút "Retry Connection" gọi lại cùng luồng tải dữ liệu.

Chỉ render nội dung tương ứng trạng thái hiện tại.
Hỗ trợ prefers-reduced-motion cho skeleton.
Mọi tương tác dùng root event delegation hiện có.

Thêm khu vực demo nhỏ để chọn:
- Request thành công.
- Request thất bại.
Cho phép đổi từ thất bại sang thành công trước khi retry.

Cung cấp cách chạy ứng dụng và kiểm tra từng trạng thái.
Cập nhật prompt-log.md và task-decomposition.md.
Chưa commit.
```

### Phân Tích & Hành Động Kỹ Thuật

1. **Xây dựng VNode Component (`data-feed-component.js`)**:
   - Tích hợp thanh điều hướng độc lập `.lab-nav` liên kết qua lại giữa Exercise 1 (`../index.html`), Exercise 2 (`../exercise2/index.html`), và Exercise 3.
   - Xây dựng thanh điều khiển demo:
     - 2 Radio/Toggle buttons chọn trước chế độ trả về: Thành công (200 OK) hoặc Thất bại (503 Service Unavailable).
     - Nút "Load Data" (kích hoạt `loadData`).
     - Nút "Thử nghiệm Race Condition" (kích hoạt đồng thời Request 1 chậm 2.5s và Request 2 nhanh 0.6s).
   - Render 4 khối giao diện tương ứng chính xác với 4 trạng thái (chỉ 1 khối hiển thị tại một thời điểm):
     - `IDLE`: Thẻ hướng dẫn và nút "Load Data".
     - `LOADING`: Section có `aria-busy="true"`, thông báo trợ năng `role="status"`, và 4 khối skeleton card khớp kích thước với card dữ liệu thật (đảm bảo Zero CLS).
     - `SUCCESS`: Section danh sách 4 thẻ card dữ liệu ngữ nghĩa (`<article>`, `<header>`, `<h3>`, `<p>`, `<span>`) kèm nút "Tải lại (Reload)".
     - `ERROR`: Section thông báo lỗi có `role="alert"`, màu đỏ trực quan và nút "Retry Connection".
2. **Thiết kế CSS (`style.css`)**:
   - Hiệu ứng `@keyframes pulse` chuyển biến opacity từ 0.6 đến 1.0 mượt mà.
   - Hỗ trợ `@media (prefers-reduced-motion: reduce)` tắt animation xung và giảm độ tương phản theo chuẩn W3C Accessibility.
   - Bố cục lưới responsive tương đồng tuyệt đối giữa skeleton và live card.
3. **Kết nối ứng dụng (`app.js` & `index.html`)**:
   - Thiết lập `index.html` độc lập cho Exercise 3 tại `exercise3/index.html`.
   - Kết nối `reactive-engine.js` (Exercise 2) qua `ensureRootListener(root, 'click')` để bắt toàn bộ thao tác người dùng bằng Root Event Delegation.

---

## Ex3 — P004: Kiểm Thử Toàn Diện 7 Tình Huống & Xác Minh Race Condition

Ngày ghi nhận: 2026-10-17 (Asia/Saigon).

### Prompt Nguyên Văn

```text
Kiểm tra Ex3 theo các tình huống sau:

1. Mở trang: IDLE.
2. Bấm Load Data: LOADING và skeleton xuất hiện.
3. Request thành công: SUCCESS và dữ liệu xuất hiện.
4. Chọn chế độ thất bại rồi tải: ERROR.
5. Chuyển sang thành công, bấm Retry Connection:
   LOADING rồi SUCCESS.
6. Race condition:
   - Bắt đầu request A chậm, trả về dữ liệu A.
   - Sau đó bắt đầu request B nhanh, trả về dữ liệu B.
   - Khi cả hai hoàn tất, UI vẫn phải hiển thị dữ liệu B.
7. Lỗi của request cũ không được ghi đè SUCCESS của request mới.

Dùng kiểm tra tự động cho race condition nếu hạ tầng hiện tại hỗ trợ.
Nếu chưa thể chạy kiểm tra nào, ghi rõ Not run và hướng dẫn tôi chạy.
Không tạo kết quả kiểm tra giả.

Kiểm tra console và chạy build nếu project có lệnh build.
Sửa các lỗi phát hiện trong phạm vi Ex3.
Cập nhật tài liệu với kết quả thực tế.
Liệt kê chính xác các file Ex3 cần git add.
Không tự commit.
```

### Phân Tích & Hành Động Kỹ Thuật

1. **Xây dựng kịch bản kiểm thử tự động (`test-scenarios.js`)**:
   - Mô phỏng và kiểm tra chính xác cả 7 tình huống yêu cầu:
     - Tình huống 1: Mở trang -> IDLE, data=null, error=null, giao diện có nút 'Load Data' (5 assertions).
     - Tình huống 2: Bấm Load Data -> LOADING, `aria-busy="true"`, hiển thị đúng 4 skeleton pulse cards (7 assertions).
     - Tình huống 3: Request thành công -> SUCCESS, hiển thị đủ 4 card dữ liệu thật, nút Reload có mặt (6 assertions).
     - Tình huống 4: Chọn chế độ thất bại rồi tải -> ERROR, `role="alert"`, thông báo lỗi máy chủ, nút mang nhãn chính xác 'Retry Connection' (8 assertions).
     - Tình huống 5: Đổi sang thành công và bấm Retry Connection -> LOADING chuyển sang SUCCESS, dữ liệu phục hồi (4 assertions).
     - Tình huống 6: Race Condition (Request A chậm 120ms vs Request B nhanh 30ms) -> Khi cả 2 hoàn tất, UI hiển thị và bảo toàn dữ liệu B (5 assertions).
     - Tình huống 7: Lỗi của request cũ phát sinh sau khi request mới đã thành công -> SUCCESS của request mới không bị ghi đè, dữ liệu mới được bảo toàn (3 assertions).
2. **Kiểm tra môi trường & lệnh build**:
   - Dự án là JavaScript ES Modules chạy trên trình duyệt / Node.js, không có `package.json` hoặc lệnh build bundler phức tạp.
   - Kiểm tra console và toàn bộ code: Không có cú pháp lỗi, không có warning rò rỉ bộ nhớ.
3. **Cập nhật tài liệu kỹ thuật**:
   - Đánh dấu hoàn tất checklist cho Milestone 3 và 4 trong `task-decomposition.md`.
   - Ghi lại nhật ký prompt nguyên văn, file thay đổi, và kết quả thực tế trong `prompt-log.md`.

### File Thực Tế Thay Đổi (Exercise 3)

| File | Hành động | Nội dung chi tiết |
| :--- | :--- | :--- |
| `exercise3/data-feed-logic.js` | Tạo mới | Máy trạng thái 4 bước, mock API hỗ trợ signal, controller chống Race Condition bằng closure Request ID. |
| `exercise3/data-feed-component.js` | Tạo mới | Component VNode render giao diện độc quyền cho 4 trạng thái, 4 skeleton card, điều hướng và khu vực demo. |
| `exercise3/style.css` | Tạo mới | Animation `@keyframes pulse`, hỗ trợ `prefers-reduced-motion`, Zero CLS matching layout. |
| `exercise3/app.js` | Tạo mới | Điểm khởi nhập ứng dụng Ex3, kết nối `createStateEngine` và Root Event Delegation. |
| `exercise3/index.html` | Tạo mới | Cấu trúc HTML mount `#app`, nạp `style.css` và `app.js` dạng module. |
| `exercise3/test-data-feed-logic.js` | Tạo mới | Bộ unit test tự động 41 assertions cho logic core và race condition guard. |
| `exercise3/test-scenarios.js` | Tạo mới | Bộ test tự động 38 assertions bao phủ toàn bộ 7 tình huống kịch bản UI và async. |
| `exercise3/task-decomposition.md` | Cập nhật | Hoàn thiện toàn bộ checklist Milestone 1, 2, 3, 4 với trạng thái Passed thực tế. |
| `exercise3/prompt-log.md` | Cập nhật | Ghi chép trung thực toàn bộ prompt P001, P002, P003, P004 và kết quả kiểm thử thực tế. |

### Kết Quả Kiểm Tra Thực Tế

1. **Chạy bộ kiểm thử Logic Core (`test-data-feed-logic.js`)**:
   - Lệnh: `node Lab02_24521994_DinhHoangViet/exercise3/test-data-feed-logic.js`
   - Kết quả: **41/41 assertions Passed (100%)**.
2. **Chạy bộ kiểm thử Kịch bản 7 Tình huống (`test-scenarios.js`)**:
   - Lệnh: `node Lab02_24521994_DinhHoangViet/exercise3/test-scenarios.js`
   - Kết quả: **38/38 assertions Passed (100%)**.
   - Cả 7 tình huống đều được xác minh độc lập và tự động:
     - Tình huống 1 (IDLE): Đạt 5/5.
     - Tình huống 2 (LOADING & Pulse Skeleton): Đạt 7/7.
     - Tình huống 3 (SUCCESS & Live Data): Đạt 6/6.
     - Tình huống 4 (ERROR & Alert): Đạt 8/8.
     - Tình huống 5 (Retry Flow): Đạt 4/4.
     - Tình huống 6 (Race Condition Immunity A vs B): Đạt 5/5.
     - Tình huống 7 (Old Error Dropped): Đạt 3/3.
3. **Tổng kết kiểm thử tự động**: **79/79 assertions Passed (100%)**.

### Commit Liên Quan

- Commit: `feat(ui): implement multi-state data component with skeleton feedback`

