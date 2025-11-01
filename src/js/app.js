/**
 * App Module - Main application logic
 * Handles download flow, state management, and event listeners
 */

import { getDownloadURL } from './api/client.js';
import { isYouTubeURL } from './utils/validate.js';
import { AUDIO_DEFAULTS, VIDEO_DEFAULTS } from './config.js';

// DOM Elements
const urlInput = document.getElementById('urlInput');
const convertBtn = document.getElementById('convertBtn');
const converterTitle = document.getElementById('converterTitle');
const videoTitle = document.getElementById('videoTitle');
const formatBtns = document.querySelectorAll('.format-btn');
const audioQualityText = document.getElementById('audioQuality');
const videoQualityText = document.getElementById('videoQualityText');
const qualityItems = document.querySelectorAll('.quality-item');
const controls = document.getElementById('controls');
const downloadActions = document.getElementById('downloadActions');
const downloadBtn = document.getElementById('downloadBtn');
const nextBtn = document.getElementById('nextBtn');

// Hidden fields
const audioBitrate = document.getElementById('audioBitrate');
const videoQuality = document.getElementById('videoQuality');
const videoCodec = document.getElementById('videoCodec');
const videoContainer = document.getElementById('videoContainer');

// Current mode and selections
let currentMode = 'audio';
let currentAudioFormat = 'mp3';
let currentAudioBitrate = '128';
let currentVideoQuality = '1080';

// App states
const STATE = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  READY: 'ready'
};

let currentState = STATE.IDLE;
let downloadData = null; // Store download URL and filename

/**
 * Set current mode and update UI
 */
function setMode(mode) {
  currentMode = mode;

  // Update format buttons
  formatBtns.forEach(btn => {
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Show error
 */
function showError(message) {
  urlInput.classList.add('error');
  urlInput.value = message;

  setTimeout(() => {
    urlInput.classList.remove('error');
    if (currentState === STATE.IDLE) {
      urlInput.value = '';
      urlInput.placeholder = 'youtube.com/watch?v=j0u7ub3-ur1';
    }
  }, 3000);
}

/**
 * Reset to initial state
 */
function resetToIdle() {
  currentState = STATE.IDLE;
  downloadData = null;

  // Reset UI
  converterTitle.style.display = 'block';
  converterTitle.textContent = 'Insert a valid video URL';
  videoTitle.textContent = '';
  videoTitle.classList.remove('show');
  urlInput.value = '';
  urlInput.placeholder = 'youtube.com/watch?v=j0u7ub3-ur1';
  urlInput.classList.remove('loading', 'completed', 'error');
  urlInput.disabled = false;

  // Show controls, hide download actions
  controls.style.display = 'flex';
  downloadActions.style.display = 'none';

  // Enable convert button
  convertBtn.disabled = false;
  const btnText = convertBtn.querySelector('.btn-text');
  if (btnText) btnText.textContent = 'Convert';
}

/**
 * Set processing state
 */
function setProcessingState() {
  currentState = STATE.PROCESSING;

  // Update input to show "extracting video"
  urlInput.value = 'extracting video';
  urlInput.classList.add('loading');
  urlInput.disabled = true;

  // Hide controls
  controls.style.display = 'none';
}

/**
 * Set ready state (show download buttons)
 */
function setReadyState(title, url, filename) {
  currentState = STATE.READY;
  downloadData = { url, filename };

  // Hide converter title, show video title
  converterTitle.style.display = 'none';
  videoTitle.textContent = title || 'Video';
  videoTitle.classList.add('show');

  // Update input to show "conversion completed"
  urlInput.value = 'conversion completed';
  urlInput.classList.remove('loading');
  urlInput.classList.add('completed');

  // Show download actions
  downloadActions.style.display = 'flex';
}

/**
 * Trigger browser download
 */
function triggerDownload(url, filename) {
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
 * Get options based on current mode
 */
function getOptions() {
  const baseOptions = currentMode === 'audio'
    ? { ...AUDIO_DEFAULTS }
    : { ...VIDEO_DEFAULTS };

  if (currentMode === 'audio') {
    baseOptions.audioFormat = currentAudioFormat;
    baseOptions.audioBitrate = currentAudioBitrate;
  } else {
    baseOptions.videoQuality = currentVideoQuality;
    baseOptions.youtubeVideoCodec = videoCodec.value;
    baseOptions.youtubeVideoContainer = videoContainer.value;
  }

  return baseOptions;
}

/**
 * Main convert handler
 */
async function handleConvert() {
  if (currentState !== STATE.IDLE) return;

  const url = urlInput.value.trim();

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
  setProcessingState();

  try {
    const options = getOptions();
    const response = await getDownloadURL(url, options);

    if (response.status === 'stream' || response.status === 'static') {
      // Success - show download button
      const filename = response.filename || `download_${Date.now()}`;
      const title = response.title || filename;

      setReadyState(title, response.url, filename);

    } else if (response.status === 'error') {
      throw response;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

  } catch (error) {
    const errorMsg = parseError(error);
    showError(errorMsg);
    resetToIdle();
  }
}

/**
 * Handle download button click
 */
function handleDownload() {
  if (!downloadData) return;

  triggerDownload(downloadData.url, downloadData.filename);
}

/**
 * Handle next button click (reset to idle)
 */
function handleNext() {
  resetToIdle();
}

/**
 * Initialize app
 */
export function init() {
  // Format toggle buttons
  formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.dataset.mode);
    });
  });

  // Quality selection
  qualityItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();

      const parentMode = item.closest('.format-option').dataset.mode;

      if (parentMode === 'audio') {
        // Audio quality selection
        const format = item.dataset.format;
        const bitrate = item.dataset.bitrate;

        if (format && bitrate) {
          currentAudioFormat = format;
          currentAudioBitrate = bitrate;

          // Update display text
          if (format === 'best') {
            audioQualityText.textContent = 'Best Quality';
          } else if (format === 'mp3') {
            audioQualityText.textContent = `${bitrate}kbps`;
          } else {
            audioQualityText.textContent = format.toUpperCase();
          }

          // Update hidden field
          audioBitrate.value = bitrate;
        }
      } else if (parentMode === 'video') {
        // Video quality selection
        const quality = item.dataset.quality;

        if (quality) {
          currentVideoQuality = quality;

          // Update display text
          if (quality === 'max') {
            videoQualityText.textContent = 'Max Quality';
          } else {
            videoQualityText.textContent = `${quality}p`;
          }

          // Update hidden field
          videoQuality.value = quality;
        }
      }
    });
  });

  // Convert button
  convertBtn.addEventListener('click', handleConvert);

  // Download button
  downloadBtn.addEventListener('click', handleDownload);

  // Next button
  nextBtn.addEventListener('click', handleNext);

  // Enter key on input
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentState === STATE.IDLE) {
      handleConvert();
    }
  });

  // Initialize
  resetToIdle();
  setMode('audio'); // Default to audio mode
}
