# Task Decomposition & Work Breakdown Structure (WBS)

**Project:** Mini-React VNode & Mounting Engine  
**Student:** Dinh Hoang Viet (24521994)  
**Standard:** Vanilla JavaScript ES Modules, Semantic HTML5, Zero External Virtual DOM Libraries  

---

## Architecture Overview
The engine is decomposed into two distinct core subsystems:
1. **Virtual DOM Creation Engine (`createElement`, `createTextElement`)**: Responsible for constructing a predictable, sanitized AST-like Virtual Node (VNode) tree.
2. **DOM Mounting Engine (`renderToDOM`)**: Responsible for consuming the VNode tree, recursively instantiating Real DOM nodes, binding attributes/events, and ensuring XSS immunity.

```
+-------------------------------------------------------------+
|                      User Component / App                    |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 1. Virtual Node Engine (createElement / createTextElement)   |
|    - Normalizes props & children                            |
|    - Auto-wraps primitives into TEXT_ELEMENT VNodes         |
|    - Flattens nested children arrays                        |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 2. Mounting Engine (renderToDOM)                             |
|    - Maps TEXT_ELEMENT -> document.createTextNode           |
|    - Maps HTML tags     -> document.createElement           |
|    - Binds properties, classes, and event listeners         |
|    - Appends children recursively                           |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Real Browser DOM Tree                   |
+-------------------------------------------------------------+
```

---

## WBS Milestone 1: Virtual Node Creation Engine (VNode AST)

### Task ID: T-01
- **Title**: Virtual Node Constructor & Text Normalization
- **Milestone**: Milestone 1 - VNode Engine
- **Target File**: `mini-react.js`

#### Scope & Requirements
- **Function `createTextElement(value)`**:
  - Accept primitive `value` (string, number).
  - Enforce explicit string casting via `String(value)`.
  - Return standardized text VNode contract: `{ type: "TEXT_ELEMENT", props: { nodeValue: string, children: [] } }`.
- **Function `createElement(type, props, ...children)`**:
  - Accept `type` (HTML tag name string), `props` (object or null/undefined), and rest parameter `children`.
  - Flatten `children` array to support dynamic nested arrays (e.g., list mappings).
  - Filter out falsy/null/undefined/boolean children (`child != null && child !== false`).
  - **Type Inspection**:
    - If `typeof child === "string"` or `typeof child === "number"`, auto-transform via `createTextElement(child)`.
    - If already an object VNode, preserve as-is.
  - Return element VNode contract: `{ type, props: { ...props, children: [...] } }`.

#### Sub-tasks Checklist
- [x] Implement `createTextElement(value)`.
- [x] Implement `createElement(type, props, ...children)`.
- [x] Handle flattening of nested arrays in `children`.
- [x] Handle null/undefined/boolean filtering in `children`.
- [x] Unit test VNode structure and children normalization in `test-runner.js`.

#### Verification Gate
- Unit tests verify structure of `createElement("header", { id: "main-header" }, "Hello")`.
- Structure strictly matches `{ type: "header", props: { id: "main-header", children: [ { type: "TEXT_ELEMENT", props: { nodeValue: "Hello", children: [] } } ] } }`.

---

## WBS Milestone 2: Real DOM Mounting & Security Engine

### Task ID: T-02
- **Title**: Recursive DOM Mounting & XSS Neutralization
- **Milestone**: Milestone 2 - DOM Mounting
- **Target File**: `mini-react.js`

#### Scope & Requirements
- **Function `renderToDOM(vnode)`**:
  - **Text Node Branch**:
    - If `vnode.type === "TEXT_ELEMENT"`, construct node using `document.createTextNode(vnode.props.nodeValue)`.
    - **XSS Prevention Contract**: Text nodes created via `document.createTextNode` MUST NEVER execute embedded HTML/scripts (e.g., `"<script>alert(1)</script>"` is rendered as harmless visible text).
  - **Element Node Branch**:
    - Create real DOM element via `document.createElement(vnode.type)`.
    - Iterate over `props` keys (excluding `children`):
      - **Event Listeners**: If prop key starts with `on` (e.g., `onClick`), attach via `addEventListener(eventType.toLowerCase(), handler)`.
      - **Class Name**: Map `className` or `class` to element class attribute.
      - **Styles**: Handle `style` attribute (string or style object).
      - **Standard Attributes**: Set attributes via `setAttribute` or direct property assignment.
  - **Recursive Child Attachment**:
    - Iterate through `vnode.props.children`, invoke `renderToDOM(child)` recursively, and append child node to parent via `parent.appendChild(childDOMNode)`.
  - Return the mounted `DOMNode`.

#### Sub-tasks Checklist
- [ ] Implement `renderToDOM(vnode)` with type discrimination.
- [ ] Implement text node instantiation via `document.createTextNode`.
- [ ] Implement element node creation and attribute/prop binding.
- [ ] Implement event handler registration for `on*` props.
- [ ] Implement recursive `appendChild` traversal.
- [ ] Verify XSS defense using string payload `"<script>alert(1)</script>"`.

#### Verification Gate
- XSS payload `"<script>alert(1)</script>"` renders strictly as text on the screen; script execution count = 0.
- `renderToDOM` returns a fully functional DOM Element with events and children intact.

---

## WBS Milestone 3: Semantic Integration, Verification & Test Runner

### Task ID: T-03
- **Title**: Semantic App Demonstration & Automated Verification
- **Milestone**: Milestone 3 - Application & Quality Assurance
- **Target Files**: `index.html`, `test-runner.js`

#### Scope & Requirements
- **Semantic HTML Contract**:
  - Demonstrate VNode tree rendering semantic layout (`<header>`, `<main>`, `<section>`, `<article>`, `<button>`).
  - Zero unnecessary wrapper `<div>` elements.
- **ES Modules Integration**:
  - Modular export of `createElement`, `createTextElement`, `renderToDOM` from `mini-react.js`.
  - Clean modular import into `index.html` (or demo app) and `test-runner.js`.
- **Automated Test Suite**:
  - `test-runner.js` executes unit assertions and prints PASS/FAIL indicators.
- **DevTools Elements Inspection**:
  - Verify that the mounted DOM tree is fully inspectable in browser DevTools.

#### Sub-tasks Checklist
- [ ] Implement demo UI in `index.html` using semantic landmarks.
- [ ] Implement automated assertions in `test-runner.js`.
- [ ] Verify accessibility and semantic tree in browser DevTools.
- [ ] Maintain continuous commit history and update prompt log.

#### Verification Gate
- 100% test assertions pass in `test-runner.js`.
- DevTools Elements tab reflects semantic landmark hierarchy without invalid wrappers.
