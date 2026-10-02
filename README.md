# Web Application Development | Lab 01: Modern Web Foundations & AI-Assisted Engineering

**Student Information:**
- **Full Name:** Đinh Hoàng Việt
- **Student ID (MSSV):** 24521994
- **University:** University of Information Technology, VNU-HCM (UIT)
- **Class / Major:** Software Engineering / Information Technology
- **Repository:** [https://github.com/Vietomato/24521994_DinhHoangViet](https://github.com/Vietomato/24521994_DinhHoangViet)

---

## 📌 Repository Overview

This repository contains all lab assignments and exercises for the **Web Application Development** course. Each exercise follows an **AI-Assisted Engineering Workflow**, structured around rigorous architectural decomposition, strict specification contracts, zero-framework Vanilla Web standards, atomic git commits, and traceable prompt logs.

### Key Technical Principles Applied:
- **Zero Frameworks:** Strictly pure HTML5, CSS3, and Vanilla JavaScript (No React, Vue, Bootstrap, or Tailwind).
- **Zero Hardcoded Colors:** All color themes strictly use CSS Custom Properties (`var(--...)`) paired across Light & Dark modes.
- **Accessibility First (WCAG 2.2 AA):** Contrast ratios $\ge 4.5:1$, explicit `<label>` bindings, keyboard navigability (Tab/Enter/Space), and screen-reader ARIA states (`aria-pressed`, `aria-live`).
- **Core Web Vitals Optimization:** Explicit image/container dimensions (`CLS = 0`) and high-priority native rendering (`LCP < 2.0s`).
- **Resilient State Architecture:** State machines modeling complete lifecycles (`idle`, `submitting`, `success`, `error`, `loading`, `empty`).
- **Traceable Engineering Pipeline:** Each exercise includes its own `TASK_DECOMPOSITION.md` (WBS), `PROMPT_LOG.md` (AI interaction history), and `Screenshot_of_Results/` folder.

---

## 📁 Repository Structure

```text
24521994_DinhHoangViet/
├── exercise_1/                 # Exercise 1: Semantic HTML5 & Baseline Styling
│   ├── index.html
│   ├── style.css
│   ├── TASK_DECOMPOSITION.md
│   └── PROMPT_LOG.md
│
├── exercise_2/                 # Exercise 2: Responsive 2D Grid & Dark Mode Engine
│   ├── index.html
│   ├── app.js
│   ├── CSS/
│   │   └── style.css
│   ├── TASK_DECOMPOSITION.md
│   ├── PROMPT_LOG.md
│   ├── wbs_ex2.jpg
│   └── Screenshot_of_Results/
│       ├── T-02A/              # Design tokens & WCAG contrast verification
│       ├── T-02B/              # 2D Grid layout, CLS = 0, Performance Fast 3G
│       └── T-02C/              # Dark Mode Engine & Console zero-error logs
│
├── exercise_3/                 # Exercise 3: Component Architecture & State Modeling
│   ├── portfolio.html
│   ├── style.css
│   ├── script.js
│   ├── images/
│   │   ├── avatar.png
│   │   └── avatar.svg
│   ├── PROMPT_LOG.md
│   └── Screenshot_of_Results/
│       ├── desktop_light_mode.png
│       ├── desktop_dark_mode.png
│       ├── hero_section_desktop.png
│       ├── form_state_submitting.png
│       ├── form_state_success.png
│       ├── tablet_responsive_768px.png
│       └── mobile_responsive_375px.png
│
├── exercise_4/                 # Exercise 4: Resilient Component Architecture
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── CSS/
│   │   └── skeleton.css        # Pure CSS Shimmer Skeleton
│   ├── images/
│   ├── TASK_DECOMPOSITION.md   # 4-State Contract & State Machine
│   ├── PROMPT_LOG.md           # Step-by-step AI prompt log
│   └── Screenshot_of_Results/
│       ├── T-03A/              # Loading Skeleton (Pure CSS Shimmer gradient)
│       ├── T-03B/              # Live Data State (Flexbox badges & 2D Grid list)
│       └── T-03C/              # Empty State & Error State with Retry Trigger
│
└── README.md                   # Master Lab Documentation (This file)
```

---

## 🛠️ Detailed Lab Exercises Breakdown

### 🔹 Exercise 1: Semantic HTML5 & Baseline Styling
- **Directory:** [`exercise_1/`](exercise_1/)
- **Objectives:** Establish semantic landmark elements (`<header>`, `<main>`, `<section>`, `<footer>`) and a structured enterprise developer baseline.
- **Key Deliverables:**
  - Semantic HTML structure.
  - Clean styling with typography hierarchy.
  - Initial Work Breakdown Structure and prompt records.

---

### 🔹 Exercise 2: Enterprise Developer Portfolio (2D Grid & Theme Engine)
- **Directory:** [`exercise_2/`](exercise_2/)
- **Objectives:** Build an enterprise portfolio with 2D Grid layout, WCAG 2.2 AA token design system, and an accessible theme switcher.
- **Sub-Tasks & Commits:**
  - `SUB-TASK T-02A`: Tokens & Reset (`feat(css): tokens & reset`) — Zero hardcoded hex colors, paired `:root` and `[data-theme="dark"]`.
  - `SUB-TASK T-02B`: 2D Grid Layout (`feat(css): responsive grid`) — Responsive Grid, mobile 375px rendering, zero CLS, and LCP < 2.0s.
  - `SUB-TASK T-02C`: Dark Mode Engine (`feat(js): dark mode engine`) — Contract-first state persistence via `localStorage.getItem('theme')`, early `<head>` script preventing FOUC.
- **Screenshots:**
  - `Screenshot_of_Results/T-02A/tokens_contrast_wcag.png`: Contrast verification.
  - `Screenshot_of_Results/T-02B/CLS.png` & `performance.png`: Performance audit.
  - `Screenshot_of_Results/T-02C/dark-mode.png` & `light-mode.png`: Theme toggle demonstration.

---

### 🔹 Exercise 3: Component Architecture & State Modeling
- **Directory:** [`exercise_3/`](exercise_3/)
- **Objectives:** Extend portfolio into a modular 7-component architecture with client-side state machines.
- **Key Components:**
  1. **Header / Navigation:** Logo, smooth anchor navigation, and Theme Switcher.
  2. **Hero Section:** Profile image with explicit `width="160"`, `height="160"`, headline, and CTA buttons.
  3. **Theme Switcher:** Vanilla JS state `isDarkMode`, dynamic icon toggling (🌙/☀️), `aria-pressed`.
  4. **Skills Matrix:** CSS Grid (`repeat(auto-fit, minmax(280px, 1fr))`) grouping Frontend, Backend, and Database.
  5. **Project Cards:** Semantic `<article class="project-card" data-category="...">` with `<header>`, `<p>`, `<footer>`.
  6. **Contact Form & State Machine:** 4-state lifecycle (`idle`, `submitting`, `success`, `error`), HTML5 native validation (`required`, `type="email"`, `minlength`).
  7. **Footer:** Contact details (`tel:`, `mailto:`) and copyright.
- **Screenshots:**
  - `desktop_light_mode.png` & `desktop_dark_mode.png`: Full page presentation.
  - `form_state_submitting.png` & `form_state_success.png`: Form state feedback.
  - `tablet_responsive_768px.png` & `mobile_responsive_375px.png`: Responsive validation.

---

### 🔹 Exercise 4: Resilient Component Architecture (The 4-State Contract)
- **Directory:** [`exercise_4/`](exercise_4/)
- **Objectives:** Implement a fault-tolerant, resilient component architecture modeling the complete data lifecycle across 4 distinct states.
- **Prompt Rule Applied:** *Never prompt AI for all 4 states at once.* (Separated into sequential sub-task prompts).
- **The 4-State Resilient Component Contract:**
  1. **Loading State (Skeleton):** Pure CSS Shimmer gradient animation (`@keyframes shimmer`) without layout shifts (CLS = 0).
  2. **Live Data State (Resolved):** 2D Grid project list with Flexbox metadata badges (`category`, `tech`).
  3. **Empty State:** Clean empty mailbox view (`📭`) when 0 items are returned.
  4. **Error State:** Accessible alert view (`role="alert"`, `aria-live="assertive"`) with an **Accessible Retry Trigger** button.
- **Sub-Tasks & Atomic Commits:**
  - `SUB-TASK T-03A`: `feat(css): skeleton`
  - `SUB-TASK T-03B`: `feat(ui): live data state`
  - `SUB-TASK T-03C`: `feat(ui): empty and error states`
- **Screenshots:**
  - `T-03A/loading_skeleton.png`: Pure CSS Shimmer placeholder.
  - `T-03B/live_data_grid.png`: Rendered 2D grid with live projects.
  - `T-03C/empty_state.png`: Empty state feedback.
  - `T-03C/error_state_retry.png`: Error state with retry trigger.

---

## 💡 How to Prompt (AI-Assisted Engineering Workflow)

When working with LLMs/AI assistants for web engineering, follow these battle-tested prompting strategies demonstrated in this repository:

### 1. The Context-First Specification Pattern
Always specify constraints, role, and forbidden tools upfront:
```text
Role: Senior Frontend Architect & Web Development Instructor
Constraints:
- Pure HTML5, CSS3, Vanilla JavaScript only (Zero frameworks, zero external CSS libs).
- High contrast WCAG 2.2 AA compliant.
- No hardcoded hex color codes in component rules.
- Explicit image width/height for Zero CLS.
```

### 2. The Decomposition Pipeline Rule
Never request monolithic implementations. Break work into sequential, testable contracts:
```text
Step 1 (Design Tokens): Define :root and [data-theme="dark"] CSS variables first.
Step 2 (Structural Skeleton): Implement pure CSS layout with explicit bounding boxes.
Step 3 (State Engine): Implement JavaScript event listeners and state transitions.
Step 4 (Validation & Error Handling): Add accessible ARIA attributes and retry triggers.
```

### 3. The 4-State Resilient Component Prompting Pattern (Exercise 4)
When handling async UI components, separate prompts by state:
- **Prompt 1 (Loading):** Create pure CSS Shimmer skeleton matching exact target dimensions to prevent CLS.
- **Prompt 2 (Resolved):** Render real data items with Flexbox badges and responsive CSS Grid.
- **Prompt 3 (Empty & Error):** Construct empty state view and error banner with keyboard-accessible retry triggers.

---

## 🚀 How to Run Locally

Since this repository uses 100% native Vanilla web standards, no build tools, bundlers, or package installations (`npm install`) are required.

### Method 1: Open Directly in Browser
Double-click any `.html` file:
- Exercise 1: `exercise_1/index.html`
- Exercise 2: `exercise_2/index.html`
- Exercise 3: `exercise_3/portfolio.html`
- Exercise 4: `exercise_4/index.html`

### Method 2: Run via VS Code Live Server
1. Open this repository folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click on any `.html` file and select **"Open with Live Server"**.

### Method 3: Run via Python HTTP Server
Open your terminal in the repository root and run:
```bash
# Python 3
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your web browser.

---

## 📜 Verification Checklist for Submission

- [x] All 4 exercises organized in clean, separate directories (`exercise_1` to `exercise_4`).
- [x] Zero external frameworks used (Pure HTML, CSS, Vanilla JS).
- [x] Zero hardcoded hex colors outside CSS token definitions.
- [x] Accessible navigation, proper form `<label>` associations, and keyboard focus states.
- [x] Complete WBS diagrams (`TASK_DECOMPOSITION.md`) and full prompt logs (`PROMPT_LOG.md`).
- [x] High-resolution screenshots of results saved in each exercise's `Screenshot_of_Results/` directory.
- [x] Clean, semantic, and beginner-friendly code suitable for academic grading.
