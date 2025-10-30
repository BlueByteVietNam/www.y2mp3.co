/**
 * UI Module - Manages all DOM elements and form controls
 * Pure UI logic, no business logic
 */

import { AUDIO_DEFAULTS, VIDEO_DEFAULTS } from './config.js';

// Cache DOM elements
const elements = {
  urlInput: document.getElementById('urlInput'),
  downloadBtn: document.getElementById('downloadBtn'),
  statusMsg: document.getElementById('statusMsg'),

  // Mode buttons
  modeButtons: document.querySelectorAll('.mode-btn'),

  // Audio options
  audioFormat: document.getElementById('audioFormat'),
  audioBitrate: document.getElementById('audioBitrate'),
  audioGroup: document.querySelector('[data-group="audio"]'),

  // Video options
  videoQuality: document.getElementById('videoQuality'),
  videoCodec: document.getElementById('videoCodec'),
  videoContainer: document.getElementById('videoContainer'),
  videoGroup: document.querySelector('[data-group="video"]')
};

let currentMode = 'audio'; // 'audio' or 'video'

/**
 * Get current download mode
 */
export function getMode() {
  return currentMode;
}

/**
 * Set mode and update UI
 */
export function setMode(mode) {
  currentMode = mode;

  // Update mode buttons
  elements.modeButtons.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Show/hide relevant options (always visible now)
  if (mode === 'audio') {
    elements.audioGroup.style.display = 'block';
    elements.videoGroup.style.display = 'none';
  } else {
    elements.audioGroup.style.display = 'none';
    elements.videoGroup.style.display = 'block';
  }
}

/**
 * Get mode button elements
 */
export function getModeButtons() {
  return elements.modeButtons;
}

/**
 * Get URL from input
 */
export function getURL() {
  return elements.urlInput.value.trim();
}

/**
 * Clear URL input
 */
export function clearURL() {
  elements.urlInput.value = '';
}

/**
 * Get download button
 */
export function getDownloadBtn() {
  return elements.downloadBtn;
}

/**
 * Update download button state
 */
export function setButtonState(text, disabled = false) {
  const textSpan = elements.downloadBtn.querySelector('.btn-text');

  if (textSpan) textSpan.textContent = text;
  elements.downloadBtn.disabled = disabled;
}

/**
 * Get all form options as object (matching backend schema)
 */
export function getOptions() {
  const baseOptions = currentMode === 'audio'
    ? { ...AUDIO_DEFAULTS }
    : { ...VIDEO_DEFAULTS };

  // Override with user selections
  if (currentMode === 'audio') {
    baseOptions.audioFormat = elements.audioFormat.value;
    baseOptions.audioBitrate = elements.audioBitrate.value;
  } else {
    baseOptions.videoQuality = elements.videoQuality.value;
    baseOptions.youtubeVideoCodec = elements.videoCodec.value;
    baseOptions.youtubeVideoContainer = elements.videoContainer.value;
  }

  return baseOptions;
}

/**
 * Show status message
 */
export function showStatus(message, type = 'info') {
  elements.statusMsg.textContent = message;
  elements.statusMsg.className = `status-msg ${type}`;
  elements.statusMsg.style.display = 'block';
}

/**
 * Hide status message
 */
export function hideStatus() {
  elements.statusMsg.style.display = 'none';
}

/**
 * Show error with input highlight
 */
export function showError(message) {
  elements.urlInput.classList.add('error');
  showStatus(message, 'error');

  setTimeout(() => {
    elements.urlInput.classList.remove('error');
  }, 3000);
}

/**
 * Show success message
 */
export function showSuccess(message) {
  showStatus(message, 'success');

  setTimeout(() => {
    hideStatus();
  }, 3000);
}
