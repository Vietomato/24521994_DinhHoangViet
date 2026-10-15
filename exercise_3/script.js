/**
 * Portfolio Application Logic
 * Exercise 3: Component Architecture & State Modeling
 * Vanilla JavaScript implementation (No frameworks, clean and beginner-friendly)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     1. THEME SWITCHER STATE & LOGIC
     ========================================================================= */

  // State Model for Theme
  // Initializes from HTML data-theme (which reads localStorage or system preference)
  let isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

  // DOM Elements for Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  /**
   * Updates the UI and DOM based on the isDarkMode state
   */
  function renderThemeUI() {
    const themeName = isDarkMode ? 'dark' : 'light';
    
    // 1. Update root dataset and HTML attribute
    document.documentElement.setAttribute('data-theme', themeName);

    // 2. Update button aria-pressed attribute for accessibility
    themeToggleBtn.setAttribute('aria-pressed', isDarkMode ? 'true' : 'false');

    // 3. Dynamically update icon and text label
    if (isDarkMode) {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Sáng';
      themeToggleBtn.setAttribute('aria-label', 'Chuyển sang giao diện sáng');
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Tối';
      themeToggleBtn.setAttribute('aria-label', 'Chuyển sang giao diện tối');
    }

    // 4. Persist to localStorage
    try {
      localStorage.setItem('theme', themeName);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  }

  // Initialize Theme UI on load
  renderThemeUI();

  // Event Listener: User clicks button -> state changes -> UI updates
  themeToggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode; // State mutation
    renderThemeUI();          // View re-render
  });

  // Support Keyboard accessibility (Enter / Space)
  themeToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggleBtn.click();
    }
  });


  /* =========================================================================
     2. CONTACT FORM STATE MODELING & VALIDATION
     ========================================================================= */

  /**
   * Form State Model
   * status can be: "idle" | "submitting" | "success" | "error"
   */
  const formState = {
    name: '',
    email: '',
    message: '',
    status: 'idle'
  };

  // DOM Elements for Contact Form
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  /**
   * Syncs input field changes to the formState model in real-time
   */
  nameInput.addEventListener('input', (e) => {
    formState.name = e.target.value.trim();
    if (nameError.textContent) validateField(nameInput, nameError);
  });

  emailInput.addEventListener('input', (e) => {
    formState.email = e.target.value.trim();
    if (emailError.textContent) validateField(emailInput, emailError);
  });

  messageInput.addEventListener('input', (e) => {
    formState.message = e.target.value.trim();
    if (messageError.textContent) validateField(messageInput, messageError);
  });

  /**
   * Native HTML5 Validation Helper for individual fields
   * @param {HTMLInputElement|HTMLTextAreaElement} field 
   * @param {HTMLElement} errorSpan 
   * @returns {boolean} isValid
   */
  function validateField(field, errorSpan) {
    if (!field.validity.valid) {
      if (field.validity.valueMissing) {
        errorSpan.textContent = 'Vui lòng không để trống trường này.';
      } else if (field.validity.typeMismatch && field.type === 'email') {
        errorSpan.textContent = 'Vui lòng nhập định dạng email hợp lệ (ví dụ: ten@domain.com).';
      } else if (field.validity.tooShort) {
        errorSpan.textContent = `Nội dung quá ngắn. Tối thiểu cần ${field.minLength} ký tự (hiện có ${field.value.length}).`;
      } else {
        errorSpan.textContent = 'Thông tin nhập chưa hợp lệ.';
      }
      return false;
    }
    errorSpan.textContent = '';
    return true;
  }

  /**
   * Validates all form inputs using native constraints
   * @returns {boolean} isFormValid
   */
  function validateEntireForm() {
    const isNameValid = validateField(nameInput, nameError);
    const isEmailValid = validateField(emailInput, emailError);
    const isMessageValid = validateField(messageInput, messageError);

    return isNameValid && isEmailValid && isMessageValid;
  }

  /**
   * Updates Form UI according to formState.status
   */
  function renderFormStateUI() {
    // Reset all status class modifiers
    formStatus.className = 'form-status';

    switch (formState.status) {
      case 'idle':
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Gửi tin nhắn';
        formStatus.textContent = '';
        formStatus.classList.remove('show');
        break;

      case 'submitting':
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Đang gửi...';
        formStatus.textContent = 'Đang gửi thông điệp của bạn, vui lòng đợi...';
        formStatus.classList.add('show', 'submitting');
        break;

      case 'success':
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Gửi tin nhắn';
        formStatus.textContent = `Cảm ơn bạn ${formState.name}! Tin nhắn của bạn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất.`;
        formStatus.classList.add('show', 'success');

        // Reset form inputs & model after successful submission
        contactForm.reset();
        formState.name = '';
        formState.email = '';
        formState.message = '';
        break;

      case 'error':
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Thử lại';
        formStatus.textContent = 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng kiểm tra lại thông tin.';
        formStatus.classList.add('show', 'error');
        break;

      default:
        break;
    }
  }

  /**
   * Form submission flow:
   * User submits form -> Validate -> status = "submitting" -> Simulate Request -> status = "success"
   */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent standard page reload

    // Sync current values into state
    formState.name = nameInput.value.trim();
    formState.email = emailInput.value.trim();
    formState.message = messageInput.value.trim();

    // 1. Native Validation Check
    const isValid = validateEntireForm();

    if (!isValid) {
      formState.status = 'error';
      renderFormStateUI();
      return;
    }

    // 2. Set State to 'submitting'
    formState.status = 'submitting';
    renderFormStateUI();

    // 3. Simulate asynchronous network request (e.g. 1.5 seconds delay)
    setTimeout(() => {
      // 4. Set State to 'success'
      formState.status = 'success';
      renderFormStateUI();

      // Return to 'idle' state after 6 seconds for clean UX
      setTimeout(() => {
        if (formState.status === 'success') {
          formState.status = 'idle';
          renderFormStateUI();
        }
      }, 6000);

    }, 1500);
  });

});
