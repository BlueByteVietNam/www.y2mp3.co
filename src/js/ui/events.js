import { urlInput, showStatus, showProgress, hideProgress, saveFile, modeSwitch, toggleMode, getIsVideoMode } from './dom.js';
import { isYouTubeURL } from '../utils/validate.js';
import { getDownloadURL, downloadFile } from '../api/client.js';

let isProcessing = false;

// Handle mode switch
modeSwitch.addEventListener('click', () => {
  toggleMode();
});

// Handle download process
async function handleDownload() {
  if (isProcessing) return;

  const url = urlInput.value.trim();

  if (!url) {
    showStatus('Please paste a YouTube URL');
    return;
  }

  if (!isYouTubeURL(url)) {
    showStatus('Invalid YouTube URL');
    return;
  }

  isProcessing = true;
  hideProgress();

  try {
    showStatus('Processing...');

    // Get download URL from API
    const response = await getDownloadURL(url, getIsVideoMode());

    if (response.status === 'tunnel' || response.status === 'redirect') {
      // Use filename from API response or fallback to default
      const ext = getIsVideoMode() ? 'mp4' : 'mp3';
      const filename = response.filename || `download_${Date.now()}.${ext}`;

      // Download file with progress
      const blob = await downloadFile(response.url, filename, {
        onProgress: (percent, text) => {
          showStatus('Downloading...');
          showProgress(percent, text);
        },
        onComplete: () => {
          showStatus('Download completed!');
          hideProgress();
        },
        onError: (error) => {
          showStatus('Download failed: ' + error.message);
          hideProgress();
        }
      });

      saveFile(blob, filename);
      showStatus('Download completed!');
      hideProgress();

      // Clear after 3 seconds
      setTimeout(() => {
        showStatus('');
        urlInput.value = '';
      }, 3000);

    } else if (response.status === 'error') {
      const errorMsg = response.error?.code || 'Download failed';
      showStatus(`Error: ${errorMsg}`);
      setTimeout(() => showStatus(''), 5000);

    } else {
      showStatus('Unexpected response from server');
      setTimeout(() => showStatus(''), 5000);
    }

  } catch (error) {
    console.error('Error:', error);
    showStatus('Network error: ' + error.message);
    setTimeout(() => showStatus(''), 5000);
  } finally {
    isProcessing = false;
  }
}

// Auto-detect when user pastes URL
urlInput.addEventListener('input', async () => {
  const url = urlInput.value.trim();

  // Auto-trigger download when valid URL is detected
  if (url && isYouTubeURL(url) && !isProcessing) {
    // Small delay to let user finish pasting
    setTimeout(() => {
      handleDownload();
    }, 500);
  }
});

// Also allow manual trigger with Enter key
urlInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    await handleDownload();
  }
});

console.log('Y2MP3 initialized');
