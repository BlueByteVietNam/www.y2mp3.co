import { urlInput, showStatus, hideProgress, modeSwitch, toggleMode, getIsVideoMode, showDownloadPopup, hideDownloadPopup, closePopup } from './dom.js';
import { isYouTubeURL } from '../utils/validate.js';
import { getDownloadURL } from '../api/client.js';

let isProcessing = false;

// Handle mode switch
modeSwitch.addEventListener('click', () => {
  toggleMode();
});

// Handle close popup
closePopup.addEventListener('click', () => {
  hideDownloadPopup();
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

      // Show download popup with link
      showDownloadPopup(response.url, filename);
      showStatus('Ready to download!');
      hideProgress();

      // Clear URL after 5 seconds
      setTimeout(() => {
        urlInput.value = '';
      }, 5000);

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
