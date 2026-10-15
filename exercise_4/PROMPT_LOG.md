# AI-Assisted Engineering Prompt Log

## Milestone: Exercise 4 (Resilient Component Architecture)

### Session Metadata
- **Date**: 2026-10-02
- **Engineer**: Đinh Hoàng Việt (MSSV: 24521994)
- **Role Persona**: Senior Frontend Architect & Performance Engineer
- **Course**: Web Application Development | Lab 1: Modern Web Foundations & AI-Assisted Engineering
- **Target Exercise**: Exercise 4 - Resilient Component Architecture
- **Task Reference Pipeline**: `TASK_DECOMPOSITION.md`

---

### The 4-State Resilient Component Contract
1. **SUB-TASK T-03A**: Loading Skeleton (Pure CSS Shimmer gradient).
2. **SUB-TASK T-03B**: Live Data State (Flexbox metadata badges & Grid list).
3. **SUB-TASK T-03C**: Empty & Error States with accessible retry trigger.

*Prompt Rule Applied: Never prompt AI for all 4 states at once.*

---

### Prompt Sequence & Engineering Decomposition

#### 📌 Prompt Step 1 (SUB-TASK T-03A: Loading Skeleton)
```text
[ENGINEERING PROMPT - T-03A]
Tạo tệp skeleton.css hiện thực hiệu ứng Pure CSS Shimmer Skeleton Loading cho danh sách thẻ dự án:
- Sử dụng @keyframes shimmer chạy lặp vô tận (infinite), background-size 200% 100%.
- Kích thước các khối skeleton (.skeleton-title, .skeleton-badge, .skeleton-line, .skeleton-link) phải khớp chính xác với kích thước dự án thực tế để triệt tiêu hiện tượng Cumulative Layout Shift (CLS = 0).
- Hỗ trợ cả Light Mode và Dark Mode qua biến CSS token.
```
- **Commit Target**: `feat(css): skeleton`

#### 📌 Prompt Step 2 (SUB-TASK T-03B: Live Data State)
```text
[ENGINEERING PROMPT - T-03B]
Hiện thực trạng thái Live Data State cho các thẻ dự án:
- Sử dụng bố cục 2D CSS Grid (repeat(auto-fit, minmax(310px, 1fr))).
- Mỗi card là một semantic HTML <article class="project-card"> có header, p, footer.
- Các thẻ tag/badges thể hiện thể loại và công nghệ (ReactJS, Node.js, Python, GNN, SOAP) được căn chỉnh bằng Flexbox (.card-badges).
```
- **Commit Target**: `feat(ui): live data state`

#### 📌 Prompt Step 3 (SUB-TASK T-03C: Empty & Error States with Retry Trigger)
```text
[ENGINEERING PROMPT - T-03C]
Hiện thực 2 trạng thái Empty State và Error State với tính năng phục hồi:
- Empty State: Hiển thị icon và hướng dẫn khi danh sách rỗng (length == 0).
- Error State: Hiển thị banner cảnh báo chuẩn trợ năng role="alert" aria-live="assertive" kèm nút Accessible Retry Trigger.
- Khi người dùng bấm Retry, chuyển giao diện về trạng thái Loading (Skeleton) và tái nạp dữ liệu thành công.
```
- **Commit Target**: `feat(ui): empty and error states`

---

### Danh mục Ảnh chụp Kết quả Thực thi (`Screenshot_of_Results/`)

| Phân hệ (Sub-Task) | Tệp ảnh minh chứng | Mô tả kỹ thuật |
| :--- | :--- | :--- |
| **T-03A** | `T-03A/loading_skeleton.png` | Hiệu ứng Pure CSS Shimmer Skeleton Gradient động (CLS = 0) |
| **T-03B** | `T-03B/live_data_grid.png` | Kết xuất danh sách dự án với 2D CSS Grid và Flexbox badges |
| **T-03C (Part 1)** | `T-03C/empty_state.png` | Trạng thái Empty State khi không có dữ liệu trả về |
| **T-03C (Part 2)** | `T-03C/error_state_retry.png` | Trạng thái Error State kèm nút Thử lại (Accessible Retry Trigger) |
