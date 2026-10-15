# AI-Assisted Engineering Prompt Log

## Milestone: T-01 (Semantic DOM Architecture & A11y Contract)

### Session Metadata
- **Date**: 2026-10-02
- **Engineer**: Dinh Hoang Viet (24521994)
- **Role Persona**: Senior Frontend Accessibility (a11y) Architect
- **Task Reference**: WBS T-01 (`TASK_DECOMPOSITION.md`)

---

### Prompt 1.1: Architecture & Constraint Definition (System Context)

```text
[ROLE]
You are a Principal Frontend Architect and Web Accessibility (a11y) Specialist specializing in W3C WCAG 2.1 AA standards and semantic DOM architecture.

[OBJECTIVE]
Generate the semantic HTML structure for a developer profile page adhering strictly to modern semantic HTML5 and accessibility contracts.

[MANDATORY CONSTRAINTS]
1. Zero-Div Contract: Strictly 0 <div> elements allowed in the document. Any <div> tag incurs an immediate build failure. Use semantic elements instead (<figure>, <article>, <section>, <address>, <nav>).
2. Landmark Tree Contract:
   - Provide an accessible skip-link (<a href="#main-content" class="skip-link">Skip to Content</a>) as the first focusable element.
   - Header with role="banner".
   - Navigation with role="navigation" and aria-label="Primary".
   - Main wrapper with id="main-content" and role="main".
   - Footer with role="contentinfo".
3. Content Breakdown:
   - Header: Profile picture (<figure>), full name (<h1>), university & faculty (<p>).
   - Navigation: Anchor links to page sections (#about, #education, #contact).
   - Main:
     * Section "about" (<h2>, profile summary).
     * Section "education" (<h2>, <article> for degrees/cohort details).
     * Section "contact" (<h2>, <address> enclosing verified mailto/tel anchors).
   - Footer: Copyright notice.
4. Scope Boundary:
   - OUTPUT HTML ONLY.
   - DO NOT generate any CSS, inline styles, or JavaScript. Commits combining HTML and CSS violate our atomic commit contract.

[VERIFICATION CRITERIA]
- DOM query document.querySelectorAll('div').length === 0 must return TRUE.
- Chrome DevTools Accessibility tree must parse a clean, unbroken Landmark hierarchy.
```

---

### AI Response & Analysis
- **Status**: Accepted with manual verification.
- **Review Summary**:
  - Validated that `div` count equals 0 using semantic `<figure>`, `<article>`, and `<address>`.
  - Added proper ARIA landmarks: `role="banner"`, `role="navigation"`, `role="main"`, and `role="contentinfo"`.
  - Confirmed the skip-link links correctly to `#main-content`.
  - Verified no CSS or styling code leaked into the milestone deliverable, satisfying the atomic commit gate.

---

### Verification Gate Audit Log
```bash
# 1. Zero-Div Validation (Console Check)
> document.querySelectorAll('div').length
< 0   # PASS

# 2. Landmark Tree Hierarchy Inspection
> Chrome DevTools -> Accessibility Tree -> Landmarks
  - banner (<header>)
  - navigation (<nav aria-label="Primary">)
  - main (<main id="main-content">)
  - contentinfo (<footer>)
  Result: VALIDATED

# 3. Atomic Boundary Check
> git status --short
  M index.html
  ?? TASK_DECOMPOSITION.md
  ?? PROMPT_LOG.md
  Result: style.css excluded from staging. Ready for atomic commit.
```
