// Main app logic with state machine
import {
  updateButton,
  getURL,
  getFormat,
  getPasteButton,
  getFormatToggle,
  showError
} from './ui.js';
import { getDownloadURL } from './api/client.js';
import { isYouTubeURL } from './utils/validate.js';

// State machine states
const STATE = {
  EMPTY: 'empty',
  PROCESSING: 'processing',
  DOWNLOADING: 'downloading',
  READY: 'ready'
};

let currentState = STATE.EMPTY;

/**
 * State machine - Updates UI based on current state
 * @param {string} newState - New state to transition to
 */
function setState(newState) {
  currentState = newState;

  switch (newState) {
    case STATE.EMPTY:
      updateButton('📋 Paste Link', false);
      break;

    case STATE.PROCESSING:
      updateButton('⏳ Processing...', true);
      break;

    case STATE.DOWNLOADING:
      updateButton('⬇️ Downloading...', true);
      break;

    case STATE.READY:
      updateButton('📋 Paste Link', false);
      // Auto reset after 1 second
      setTimeout(() => {
        setState(STATE.EMPTY);
      }, 1000);
      break;
  }
}

/**
 * Auto trigger download
 * @param {string} url - Download URL
 * @param {string} filename - Filename
 */
function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Main paste and download handler
 */
async function handlePaste() {
  // Only allow paste when in EMPTY or READY state
  if (currentState !== STATE.EMPTY && currentState !== STATE.READY) return;

  let url = '';

  // Try to get URL from clipboard first
  try {
    url = await navigator.clipboard.readText();
  } catch (err) {
    // Fallback to input field value
    url = getURL();
  }

  url = url.trim();

  // Validate URL
  if (!url || !isYouTubeURL(url)) {
    showError('Please paste a valid YouTube URL');
    return;
  }

  // Start processing
  setState(STATE.PROCESSING);

  try {
    // Wait 3s before fetching (URL needs time to stream)

    // Get download URL from API
    const response = await getDownloadURL(url, getFormat() === 'MP4');

    if (response.status === 'tunnel' || response.status === 'redirect') {

      // Generate filename
      const ext = getFormat().toLowerCase();
      const filename = response.filename || `download_${Date.now()}.${ext}`;

      // Auto trigger browser download
      triggerDownload(response.url, filename);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success
      setState(STATE.READY);

    } else {
      throw new Error(response.error?.code || 'Download failed');
    }

  } catch (error) {
    console.error('Error:', error);
    showError('Download failed. Please try again.');
    setState(STATE.EMPTY);
  }
}

/**
 * Toggle format between MP3 and MP4 (switcher style)
 */
function handleFormatToggle(event) {
  // Check if clicked on a format option
  const option = event.target.closest('.format-option');
  if (!option) return;

  const format = option.dataset.format.toUpperCase();

  // Update active state
  document.querySelectorAll('.format-option').forEach(opt => {
    opt.classList.remove('active');
  });
  option.classList.add('active');

  // Update format in UI module
  updateButton(format, false, true);
}

/**
 * Initialize app - Setup event listeners
 */
export function init() {
  const input = document.getElementById('urlInput');

  // Paste button click
  getPasteButton().onclick = handlePaste;

  // Format toggle click (delegate to format options)
  getFormatToggle().onclick = handleFormatToggle;

  // Enter key support
  input.onkeydown = (e) => {
    if (e.key === 'Enter') handlePaste();
  };

  // Initialize state
  setState(STATE.EMPTY);

  console.log('Y2MP3 initialized - All In One Input mode');
}
