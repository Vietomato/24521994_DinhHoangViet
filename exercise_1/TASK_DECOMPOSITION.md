# Task Decomposition & WBS

## WBS Task: T-01
- **Task ID**: T-01
- **Title**: Semantic DOM Architecture & A11y Contract
- **Milestone**: Atomic Milestone T-01 (Semantic Landmark Tree)

### Scope & Requirements
- **Landmark Hierarchy Contract**: Construct page layout using semantic HTML5 landmark roles (`banner`, `navigation`, `main`, `contentinfo`).
- **Zero-Div Contract**: Strict requirement of 0 `<div>` elements across the DOM tree.
- **Skip-Link**: Accessible skip navigation link pointing to `#main-content`.

### Sub-tasks Checklist
- [x] Implement skip-link (`<a href="#main-content" class="skip-link">Skip to Content</a>`).
- [x] Structure landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) with appropriate ARIA roles and labels.
- [x] Use semantic tags (`<figure>`, `<article>`, `<section>`, `<address>`) with 0 `<div>` tags.
- [x] Verify landmark hierarchy in Chrome DevTools (Accessibility tree).
- [ ] Atomic Commit: `feat(html): semantic landmark tree`.

### Verification Gate
- [ ] 0 `<div>` elements verified in DOM.
- [ ] Chrome DevTools Accessibility tree validates full landmark hierarchy.
- [ ] Git commit isolates HTML changes without CSS.
