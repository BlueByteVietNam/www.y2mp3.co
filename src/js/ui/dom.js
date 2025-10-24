// DOM elements
export const urlInput = document.getElementById('urlInput');
export const status = document.getElementById('status');
export const progress = document.getElementById('progress');
export const progressText = document.getElementById('progressText');
export const modeSwitch = document.getElementById('modeSwitch');
export const downloadPopup = document.getElementById('downloadPopup');
export const downloadLink = document.getElementById('downloadLink');
export const closePopup = document.getElementById('closePopup');

// Mode state
export let isVideoMode = false;

export function toggleMode() {
  isVideoMode = !isVideoMode;
  modeSwitch.textContent = isVideoMode ? 'MP4' : 'MP3';
}

export function getIsVideoMode() {
  return isVideoMode;
}

// Show status message
export function showStatus(message) {
  status.textContent = message;
}

// Show progress bar
export function showProgress(percent, text) {
  progress.style.display = 'block';
  progressText.style.display = 'block';
  progress.value = percent;
  progressText.textContent = text;
}

// Hide progress bar
export function hideProgress() {
  progress.style.display = 'none';
  progressText.style.display = 'none';
}

// Show download popup
export function showDownloadPopup(url, filename) {
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadPopup.hidden = false;
}

// Hide download popup
export function hideDownloadPopup() {
  downloadPopup.hidden = true;
  downloadLink.href = '';
  downloadLink.download = '';
}
