/**
 * Mini-React Virtual DOM Engine
 * Module: VNode Creation Factory & DOM Mounting Engine
 */

/**
 * Type guard kiểm tra một đối tượng có phải là VNode hợp lệ hay không.
 * Một VNode hợp lệ phải là object non-null, có type là string,
 * có props là object non-null và props.children là một Array.
 *
 * @param {unknown} node - Đối tượng cần kiểm tra
 * @returns {boolean} true nếu là VNode hợp lệ, ngược lại false
 */
export function isVNode(node) {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof node.type === "string" &&
    typeof node.props === "object" &&
    node.props !== null &&
    Array.isArray(node.props.children)
  );
}

/**
 * Tạo một Text VNode đại diện cho văn bản thuần túy.
 *
 * @param {string | number} value - Giá trị văn bản hoặc số
 * @returns {object} Text VNode có type là "TEXT_ELEMENT"
 */
export function createTextElement(value) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: String(value),
      children: []
    }
  };
}

/**
 * Factory function tạo Element VNode đại diện cho phần tử DOM.
 *
 * @param {string} type - Tên thẻ HTML (ví dụ: 'header', 'main', 'button', 'section')
 * @param {object | null | undefined} props - Các thuộc tính/props của thẻ
 * @param {...any} children - Danh sách phần tử con (VNode, primitive, hoặc mảng lồng nhau)
 * @returns {object} Element VNode có dạng { type, props: { ...props, children } }
 * @throws {TypeError} Khi một child là object không hợp lệ (không phải VNode)
 */
export function createElement(type, props, ...children) {
  const normalizedChildren = [];
  // Hỗ trợ mảng children lồng nhau đa cấp (flatten)
  const flatChildren = children.flat(Infinity);

  for (const child of flatChildren) {
    // 1. Bỏ qua các giá trị null, undefined và boolean (giống React JSX)
    if (child === null || child === undefined || typeof child === "boolean") {
      continue;
    }

    // 2. Chuyển đổi children kiểu primitive (string hoặc number) thành Text VNode
    if (typeof child === "string" || typeof child === "number") {
      normalizedChildren.push(createTextElement(child));
      continue;
    }

    // 3. Giữ nguyên children nếu đã là VNode hợp lệ
    if (isVNode(child)) {
      normalizedChildren.push(child);
      continue;
    }

    // 4. Ném TypeError khi child là object không hợp lệ hoặc kiểu dữ liệu không được hỗ trợ
    const details = typeof child === "object" ? JSON.stringify(child) : String(child);
    throw new TypeError(
      `[mini-react] Invalid child element: Expected a valid VNode, string, or number, but received: ${details}`
    );
  }

  return {
    type,
    props: {
      ...(props || {}),
      children: normalizedChildren
    }
  };
}

/**
 * Chuyển đổi một VNode (và toàn bộ cây con) thành Real DOM Node.
 *
 * @param {object} vnode - Virtual DOM node cần render
 * @returns {Node} Real DOM node đã được tạo (HTMLElement hoặc Text)
 * @throws {TypeError} Khi vnode không phải là VNode hợp lệ, hoặc event handler không phải là function
 */
export function renderToDOM(vnode) {
  // 1. Kiểm tra VNode trước khi xử lý
  if (!isVNode(vnode)) {
    const details = typeof vnode === "object" ? JSON.stringify(vnode) : String(vnode);
    throw new TypeError(
      `[mini-react] Invalid VNode: renderToDOM expects a valid VNode object, but received: ${details}`
    );
  }

  // 2. Dùng document.createTextNode cho text VNode (miễn nhiễm hoàn toàn với XSS)
  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  // 3. Dùng document.createElement cho element VNode (không tạo wrapper thừa)
  const dom = document.createElement(vnode.type);

  // 4. Duyệt các props và ánh xạ sang thuộc tính/sự kiện của Real DOM
  for (const [key, value] of Object.entries(vnode.props)) {
    // Không gán children thành thuộc tính HTML
    if (key === "children") {
      continue;
    }

    // Hỗ trợ sự kiện (bắt đầu bằng "on", ví dụ onClick, onInput)
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      // Yêu cầu: Event handler phải là function
      if (typeof value !== "function") {
        throw new TypeError(
          `[mini-react] Expected event handler for prop '${key}' to be a function, but received: ${typeof value}`
        );
      }
      dom.addEventListener(eventType, value);
      continue;
    }

    // Chuyển className thành thuộc tính class
    if (key === "className" || key === "class") {
      if (value != null && value !== false) {
        dom.setAttribute("class", String(value));
      }
      continue;
    }

    // Hỗ trợ thuộc tính style (dạng chuỗi hoặc object)
    if (key === "style") {
      if (typeof value === "string") {
        dom.setAttribute("style", value);
      } else if (typeof value === "object" && value !== null) {
        Object.assign(dom.style, value);
      }
      continue;
    }

    // Xử lý các thuộc tính HTML thông thường khác
    if (value === true) {
      dom.setAttribute(key, "");
    } else if (value !== false && value != null) {
      dom.setAttribute(key, String(value));
    }
  }

  // 5. Render các phần tử con bằng đệ quy (tuyệt đối không dùng innerHTML)
  for (const child of vnode.props.children) {
    const childDOM = renderToDOM(child);
    dom.appendChild(childDOM);
  }

  // 6. Trả về DOM node để bên gọi tự mount vào vị trí mong muốn
  return dom;
}
