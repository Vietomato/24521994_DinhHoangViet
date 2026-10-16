/**
 * Mini-React Virtual DOM Engine
 * Module: VNode Creation Factory
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

