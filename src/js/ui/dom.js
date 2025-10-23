// DOM elements
export const urlInput = document.getElementById('urlInput');
export const status = document.getElementById('status');
export const progress = document.getElementById('progress');
export const progressText = document.getElementById('progressText');
export const modeSwitch = document.getElementById('modeSwitch');

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

// Save file to user's computer
export function saveFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download.mp3';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
