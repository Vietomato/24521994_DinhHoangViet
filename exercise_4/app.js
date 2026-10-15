/**
 * Exercise 4: Resilient Component Architecture
 * The 4-State Resilient Component Contract:
 * - SUB-TASK T-03A: Loading Skeleton (Pure CSS Shimmer)
 * - SUB-TASK T-03B: Live Data State (Flexbox metadata badges & Grid list)
 * - SUB-TASK T-03C: Empty & Error States with accessible retry trigger
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. THEME SWITCHER ENGINE
     ========================================================================= */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  let isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  function renderTheme() {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleBtn.setAttribute('aria-pressed', isDarkMode ? 'true' : 'false');
    if (isDarkMode) {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Sáng';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Tối';
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }

  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    renderTheme();
  });
  renderTheme();


  /* =========================================================================
     2. MOCK DATA REPOSITORY
     ========================================================================= */
  const MOCK_PROJECTS = [
    {
      id: 1,
      title: 'Badminton E-Commerce Platform',
      category: 'Web',
      tech: 'ReactJS / Node.js',
      description: 'Sàn thương mại điện tử chuyên dụng cho dụng cụ thể thao cầu lông, hỗ trợ giỏ hàng phân tán và thanh toán bảo mật với hiệu năng tải tức thì.',
      link: 'https://github.com'
    },
    {
      id: 2,
      title: 'Fake News Detection System',
      category: 'AI',
      tech: 'Python / GNN',
      description: 'Hệ thống AI ứng dụng mạng nơ-ron đồ thị phân tích cấu trúc lan truyền thông tin, xác định tin giả mạo với độ chính xác cao và độ trễ thấp.',
      link: 'https://github.com'
    },
    {
      id: 3,
      title: 'SOAP Enterprise Microservices',
      category: 'Backend',
      tech: 'Node.js / MongoDB',
      description: 'Hệ thống vi dịch vụ chuẩn hóa dữ liệu ngân hàng, bảo đảm tính toàn vẹn giao dịch và tích hợp giao thức bảo mật cao cấp.',
      link: 'https://github.com'
    }
  ];


  /* =========================================================================
     3. 4-STATE RESILIENT COMPONENT RENDER ENGINE
     ========================================================================= */
  const container = document.getElementById('projects-container');
  const stateButtons = document.querySelectorAll('.state-btn');

  // Component State: 'loading' | 'live' | 'empty' | 'error'
  let currentState = 'live';

  /**
   * Render SUB-TASK T-03A: Loading Skeleton (Pure CSS Shimmer)
   */
  function renderLoadingSkeleton() {
    return `
      <div class="projects-grid" aria-label="Đang tải danh sách dự án...">
        ${[1, 2, 3].map(() => `
          <div class="skeleton-card" aria-hidden="true">
            <div class="skeleton-header">
              <span class="skeleton-item skeleton-title"></span>
              <span class="skeleton-item skeleton-badge"></span>
            </div>
            <div class="skeleton-body">
              <span class="skeleton-item skeleton-line full"></span>
              <span class="skeleton-item skeleton-line medium"></span>
              <span class="skeleton-item skeleton-line short"></span>
            </div>
            <div class="skeleton-footer">
              <span class="skeleton-item skeleton-link"></span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render SUB-TASK T-03B: Live Data State (Flexbox metadata badges & Grid list)
   */
  function renderLiveData(projects) {
    return `
      <div class="projects-grid">
        ${projects.map(proj => `
          <article class="project-card" data-category="${proj.category.toLowerCase()}">
            <header class="card-header">
              <h2 class="project-title">${proj.title}</h2>
              <div class="card-badges">
                <span class="badge badge-category">${proj.category}</span>
                <span class="badge badge-tech">${proj.tech}</span>
              </div>
            </header>
            <p class="project-description">${proj.description}</p>
            <footer class="card-footer">
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="card-link" aria-label="Xem mã nguồn dự án ${proj.title}">
                View Project &rarr;
              </a>
            </footer>
          </article>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render SUB-TASK T-03C (Part 1): Empty State
   */
  function renderEmptyState() {
    return `
      <div class="resilient-state-box" role="status">
        <span class="state-icon" aria-hidden="true">📭</span>
        <h2 class="state-heading">Không Có Dữ Liệu Dự Án</h2>
        <p class="state-message">
          Hiện tại chưa có dự án nào thỏa mãn tiêu chí lọc hoặc kho lưu trữ đang trống. Vui lòng thử lại sau.
        </p>
        <button type="button" class="btn-retry" id="reload-btn">
          <span>Tải lại dữ liệu mẫu</span>
        </button>
      </div>
    `;
  }

  /**
   * Render SUB-TASK T-03C (Part 2): Error State with Accessible Retry Trigger
   */
  function renderErrorState() {
    return `
      <div class="resilient-state-box error-state-box" role="alert" aria-live="assertive">
        <span class="state-icon" aria-hidden="true">⚠️</span>
        <h2 class="state-heading">Không Thể Tải Dữ Liệu</h2>
        <p class="state-message">
          Hệ thống gặp sự cố khi kết nối tới máy chủ dự án (HTTP 503 Service Unavailable). Hãy kích hoạt nút thử lại bên dưới.
        </p>
        <button type="button" class="btn-retry" id="retry-btn" aria-label="Thử kết nối lại hệ thống dữ liệu">
          <span aria-hidden="true">🔄</span>
          <span>Thử lại (Retry)</span>
        </button>
      </div>
    `;
  }

  /**
   * Main Dispatcher for the 4-State Machine
   */
  function setComponentState(newState) {
    currentState = newState;

    // Update Controller Button Active styles
    stateButtons.forEach(btn => {
      if (btn.getAttribute('data-state') === newState) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Render corresponding view
    switch (newState) {
      case 'loading':
        container.innerHTML = renderLoadingSkeleton();
        break;

      case 'live':
        container.innerHTML = renderLiveData(MOCK_PROJECTS);
        break;

      case 'empty':
        container.innerHTML = renderEmptyState();
        document.getElementById('reload-btn')?.addEventListener('click', () => {
          setComponentState('loading');
          setTimeout(() => setComponentState('live'), 1000);
        });
        break;

      case 'error':
        container.innerHTML = renderErrorState();
        // Accessible Retry Trigger
        document.getElementById('retry-btn')?.addEventListener('click', () => {
          setComponentState('loading');
          setTimeout(() => setComponentState('live'), 1200);
        });
        break;

      default:
        break;
    }
  }

  // Register state button controls
  stateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetState = btn.getAttribute('data-state');
      setComponentState(targetState);
    });
  });

  // Initial State: Live data
  setComponentState('live');

});
