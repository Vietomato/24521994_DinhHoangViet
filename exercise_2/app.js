/**
 * Dark Mode Engine (SUB-TASK T-02C)
 * Contract-First Constraints:
 * - State persistence strictly via localStorage key 'theme'
 * - Zero console errors during dynamic theme toggling
 * - Keyboard navigation Tab & Enter flow support
 */

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Đọc theme hiện tại từ data-theme (đã được khởi tạo từ inline script)
  const getCurrentTheme = () => {
    return root.getAttribute('data-theme') || 'light';
  };

  // Cập nhật theme và lưu vào localStorage với key chuẩn 'theme'
  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  };

  // Lắng nghe sự kiện click trên nút toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = getCurrentTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });

    // Hỗ trợ luồng phím Tab & Enter/Space chuẩn accessibility
    themeToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggleBtn.click();
      }
    });
  }

  // Lắng nghe thay đổi hệ điều hành nếu user chưa từng set thủ công
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    } catch (err) {
      // Ignored
    }
  });
});
