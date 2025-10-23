import { API_URL, AUTH_TOKEN, AUDIO_CONFIG, VIDEO_CONFIG } from '../config.js';

// Call API to get download URL
export async function getDownloadURL(url, isVideoMode = false) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (AUTH_TOKEN && AUTH_TOKEN !== '') {
    headers['Authorization'] = `Api-Key ${AUTH_TOKEN}`;
  }

  const config = isVideoMode ? VIDEO_CONFIG : AUDIO_CONFIG;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url,
      ...config
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

// Download file with progress tracking
export async function downloadFile(url, filename, callbacks) {
  const { onProgress, onComplete, onError } = callbacks;

  try {
    onProgress(0, 'Downloading...');

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentLength = response.headers.get('Estimated-Content-Length');

    if (!contentLength) {
      // No content length, download without progress
      const blob = await response.blob();
      return blob;
    }

    const total = parseInt(contentLength, 10);
    let received = 0;
    const chunks = [];

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      received += value.length;

      const percent = Math.round((received / total) * 100);
      const receivedMB = (received / 1024 / 1024).toFixed(2);
      const totalMB = (total / 1024 / 1024).toFixed(2);

      onProgress(percent, `${percent}% (${receivedMB}MB / ${totalMB}MB)`);
    }

    // Combine chunks into blob
    const blob = new Blob(chunks);
    return blob;

  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
}
