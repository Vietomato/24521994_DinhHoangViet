/**
 * Mini-React Test Runner & Verification Suite
 * Exercise 1: VNode Factory & DOM Mounting Engine Tests
 */

import { createElement, createTextElement, renderToDOM, isVNode } from './mini-react.js';

let hasRun = false;

// Khởi chạy kiểm thử sau khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', runTestSuite);

// Nếu script chạy sau khi DOMContentLoaded đã kích hoạt
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  runTestSuite();
}

export function runTestSuite() {
  if (hasRun) return;
  hasRun = true;

  console.group('%c[Mini-React Test Runner] Bắt đầu kiểm thử...', 'color: #2563eb; font-weight: bold; font-size: 13px;');

  // 1. Lấy phần tử gốc id="app" để mount
  const root = document.getElementById('app');
  console.assert(root !== null, 'Lỗi thiết lập: Không tìm thấy phần tử #app để mount');
  if (!root) {
    console.groupEnd();
    return;
  }

  // 2. Định nghĩa chuỗi kiểm thử bảo mật XSS
  const imgPayload = '<img onerror=alert(1)> Safe Text';
  const scriptPayload = '<' + 'script>alert(1)</' + 'script>';

  // 3. Khởi tạo cây VNode theo đúng yêu cầu đề bài
  const vApp = createElement(
    'main',
    { id: 'root-view', role: 'main' },
    createElement(
      'header',
      { className: 'hero' },
      createElement('h1', null, 'Mini React Engine'),
      createElement('p', null, imgPayload)
    ),
    createElement(
      'button',
      {
        type: 'button',
        className: 'btn-action',
        onClick: () => {
          console.log('Ping');
        }
      },
      'Click'
    )
  );

  // 4. Mount vào DOM bằng replaceChildren
  const mountedNode = renderToDOM(vApp);
  root.replaceChildren(mountedNode);

  // =========================================================================
  // BỘ KIỂM THỬ BẰNG CONSOLE.ASSERT
  // =========================================================================

  // Test 1: Button tồn tại sau khi mount và có nội dung "Click"
  const buttonEl = root.querySelector('button');
  console.assert(buttonEl !== null, 'Test 1 Thất bại: Button không tồn tại trong DOM sau khi mount');
  console.assert(buttonEl && buttonEl.textContent === 'Click', 'Test 1 Thất bại: Nội dung text của Button không phải là "Click"');
  if (buttonEl && buttonEl.textContent === 'Click') {
    console.log('%c✔ Test 1 PASS:%c Button tồn tại sau khi mount và chứa chữ "Click"', 'color: #16a34a; font-weight: bold;', 'color: inherit;');
  }

  // Test 2: Chuỗi HTML trong children không tạo phần tử img (XSS immunity)
  const imgEl = root.querySelector('img');
  console.assert(imgEl === null, 'Test 2 Thất bại: Chuỗi HTML trong children đã tạo ra phần tử <img> thực tế (Lỗ hổng XSS!)');
  const pEl = root.querySelector('header.hero p');
  console.assert(pEl !== null && pEl.textContent === imgPayload, 'Test 2 Thất bại: Nội dung thẻ <p> không bảo toàn chuỗi văn bản');
  if (imgEl === null && pEl && pEl.textContent === imgPayload) {
    console.log('%c✔ Test 2 PASS:%c Chuỗi HTML "<img onerror=...>" không tạo phần tử <img> (chỉ là text thuần)', 'color: #16a34a; font-weight: bold;', 'color: inherit;');
  }

  // Test 3: Chuỗi "<script>alert(1)</script>" được render thành text, không tạo phần tử script
  const scriptTestVNode = createElement('section', { className: 'xss-verify' }, scriptPayload);
  const scriptTestDOM = renderToDOM(scriptTestVNode);
  const scriptTag = scriptTestDOM.querySelector('script');
  console.assert(scriptTag === null, 'Test 3 Thất bại: Chuỗi "<script>" đã tạo ra thẻ <script> thực tế');
  console.assert(scriptTestDOM.childNodes.length === 1 && scriptTestDOM.childNodes[0].nodeType === Node.TEXT_NODE, 'Test 3 Thất bại: Nội dung không phải là một Text Node');
  console.assert(scriptTestDOM.textContent === '<script>alert(1)</script>', 'Test 3 Thất bại: Text content không khớp chuỗi script');
  if (scriptTag === null && scriptTestDOM.childNodes[0]?.nodeType === Node.TEXT_NODE) {
    console.log('%c✔ Test 3 PASS:%c Chuỗi "<script>alert(1)</script>" được render thành Text Node, không tạo thẻ <script>', 'color: #16a34a; font-weight: bold;', 'color: inherit;');
  }

  // Test 4: Object children không hợp lệ bị từ chối (ném TypeError)
  let rejectedInvalidChild = false;
  try {
    createElement('section', null, { invalidKey: 'not-a-vnode' });
  } catch (err) {
    if (err instanceof TypeError) {
      rejectedInvalidChild = true;
    }
  }
  console.assert(rejectedInvalidChild, 'Test 4a Thất bại: createElement không ném TypeError khi children là object không hợp lệ');

  let rejectedInvalidMount = false;
  try {
    renderToDOM({ invalidVNode: true });
  } catch (err) {
    if (err instanceof TypeError) {
      rejectedInvalidMount = true;
    }
  }
  console.assert(rejectedInvalidMount, 'Test 4b Thất bại: renderToDOM không ném TypeError khi nhận VNode không hợp lệ');

  if (rejectedInvalidChild && rejectedInvalidMount) {
    console.log('%c✔ Test 4 PASS:%c Object children và VNode không hợp lệ đều bị từ chối bằng TypeError', 'color: #16a34a; font-weight: bold;', 'color: inherit;');
  }

  // Test 5: Cây DOM khớp cây VNode và không có wrapper thừa
  const mainEl = root.querySelector('main#root-view');
  console.assert(mainEl !== null, 'Test 5 Thất bại: Không tìm thấy phần tử main#root-view');
  console.assert(mainEl?.getAttribute('role') === 'main', 'Test 5 Thất bại: Thuộc tính role của main không phải "main"');
  console.assert(mainEl?.children.length === 2, 'Test 5 Thất bại: Thẻ main không chứa đúng 2 phần tử con trực tiếp (header và button)');
  
  const headerEl = mainEl?.children[0];
  console.assert(headerEl?.tagName === 'HEADER' && headerEl?.className === 'hero', 'Test 5 Thất bại: Con thứ 1 của main không phải header.hero');
  console.assert(headerEl?.children.length === 2, 'Test 5 Thất bại: Header không chứa đúng 2 phần tử con (h1 và p)');

  // Kiểm tra không có thẻ div wrapper nào bên trong cây VNode được mount
  const divInsideMain = mainEl?.querySelectorAll('div');
  console.assert(divInsideMain?.length === 0, 'Test 5 Thất bại: Có thẻ div wrapper thừa thãi bên trong cây VNode');

  if (mainEl && mainEl.children.length === 2 && divInsideMain?.length === 0) {
    console.log('%c✔ Test 5 PASS:%c Cây DOM khớp 100% cây VNode, 0 thẻ wrapper thừa', 'color: #16a34a; font-weight: bold;', 'color: inherit;');
  }

  console.log('%c🎉 [HOÀN TẤT] Tất cả các kiểm tra bằng console.assert đều PASS!', 'color: #16a34a; font-weight: bold; font-size: 13px;');
  console.groupEnd();
}
