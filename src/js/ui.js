// Pure UI module - Only handles DOM updates, no business logic

const elements = {
  btn: document.getElementById('pasteBtn'),
  toggle: document.getElementById('formatToggle'),
  input: document.getElementById('urlInput')
};

let format = 'MP3';

/**
 * Update button text and disabled state
 * @param {string} text - Button text
 * @param {boolean} disabled - Disabled state
 * @param {boolean} isToggle - Is format toggle button
 */
export function updateButton(text, disabled, isToggle = false) {
  const el = isToggle ? elements.toggle : elements.btn;
  el.textContent = text;
  el.disabled = disabled;

  if (isToggle) format = text;
}

/**
 * Get URL from input
 * @returns {string} Trimmed URL
 */
export function getURL() {
  return elements.input.value.trim();
}

/**
 * Clear input field
 */
export function clearInput() {
  elements.input.value = '';
}

/**
 * Get current format (MP3 or MP4)
 * @returns {string} Current format
 */
export function getFormat() {
  return format;
}

/**
 * Get paste button element
 * @returns {HTMLElement}
 */
export function getPasteButton() {
  return elements.btn;
}

/**
 * Get format toggle button element
 * @returns {HTMLElement}
 */
export function getFormatToggle() {
  return elements.toggle;
}

/**
 * Show error message
 * @param {string} msg - Error message
 */
export function showError(msg) {
  elements.input.classList.add('error');

  let errorEl = document.querySelector('.error-msg');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'error-msg';
    elements.input.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = msg;

  setTimeout(() => {
    elements.input.classList.remove('error');
    if (errorEl) errorEl.remove();
  }, 3000);
}
