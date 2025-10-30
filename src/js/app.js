/**
 * App Module - Main application logic
 * Handles download flow, state management, and event listeners
 */

import {
  setMode,
  getModeButtons,
  getURL,
  getDownloadBtn,
  getOptions,
  setButtonState,
  showError,
  showSuccess,
  showStatus,
  hideStatus
} from './ui.js';
import { getDownloadURL } from './api/client.js';
import { isYouTubeURL } from './utils/validate.js';

// App states
const STATE = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  DOWNLOADING: 'downloading'
};

let currentState = STATE.IDLE;

/**
 * Update UI based on state
 */
function setState(state) {
  currentState = state;

  switch (state) {
    case STATE.IDLE:
      setButtonState('Download', false);
      hideStatus();
      break;

    case STATE.PROCESSING:
      setButtonState('Processing...', true);
      showStatus('Processing your request...', 'info');
      break;

    case STATE.DOWNLOADING:
      setButtonState('Downloading...', true);
      showStatus('Preparing download...', 'info');
      break;
  }
}

/**
 * Trigger browser download
 */
async function triggerDownload(url, filename) {
  // Verify URL is accessible before triggering download
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Stream not available (${response.status})`);
    }
  } catch (error) {
    console.error('Stream verification failed:', error);
    throw new Error('Download link expired or unavailable. Please try again.');
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Parse error from backend response
 */
function parseError(error) {
  if (error?.error?.code) {
    const code = error.error.code;

    // Map backend error codes to user-friendly messages
    const errorMap = {
      'error.api.link.missing': 'Please provide a YouTube URL',
      'error.api.link.invalid': 'Invalid YouTube URL',
      'error.api.link.unsupported': 'This service is not supported',
      'error.api.invalid_body': 'Invalid request parameters',
      'error.api.content.too_long': 'Video is too long (max duration exceeded)',
      'error.api.fetch.critical': 'Failed to fetch video information',
      'error.api.fetch.critical.core': 'Critical server error'
    };

    return errorMap[code] || `Error: ${code}`;
  }

  return 'Download failed. Please try again.';
}

/**
 * Main download handler
 */
async function handleDownload() {
  if (currentState !== STATE.IDLE) return;

  const url = getURL();

  // Validate URL
  if (!url) {
    showError('Please enter a YouTube URL');
    return;
  }

  if (!isYouTubeURL(url)) {
    showError('Please enter a valid YouTube URL');
    return;
  }

  // Start processing
  setState(STATE.PROCESSING);

  try {
    // Get options from UI
    const options = getOptions();

    console.log('Download Request:', { url, options });

    // Call API
    const response = await getDownloadURL(url, options);

    console.log('Download Response:', response);

    // Handle different response statuses
    if (response.status === 'stream' || response.status === 'static') {
      // SUCCESS - Backend returned download URL
      setState(STATE.DOWNLOADING);

      const filename = response.filename || `download_${Date.now()}`;

      // Trigger browser download with verification
      await triggerDownload(response.url, filename);

      // Show success message
      showSuccess(`✓ Download started: ${filename}`);

      // Reset to idle after delay

      setState(STATE.IDLE);

    } else if (response.status === 'error') {
      // ERROR - Backend returned error
      throw response;

    } else {
      // UNEXPECTED - Unknown status
      throw new Error(`Unexpected response status: ${response.status}`);
    }

  } catch (error) {
    console.error('Download Error:', error);

    const errorMsg = parseError(error);
    showError(errorMsg);

    setState(STATE.IDLE);
  }
}

/**
 * Handle mode switch (MP3/MP4)
 */
function handleModeSwitch(event) {
  const btn = event.target.closest('.mode-btn');
  if (!btn) return;

  const mode = btn.dataset.mode;
  setMode(mode);
}

/**
 * Initialize app
 */
export function init() {
  // Mode toggle
  getModeButtons().forEach(btn => {
    btn.addEventListener('click', handleModeSwitch);
  });

  // Download button
  getDownloadBtn().addEventListener('click', handleDownload);

  // Enter key on input
  const urlInput = document.getElementById('urlInput');
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleDownload();
    }
  });

  // Initialize state
  setState(STATE.IDLE);
  setMode('audio'); // Default to audio mode

  console.log('✓ Y2MP3 initialized - Simple UI with full options');
  console.log('Backend API Schema: 100% mapped');
}
