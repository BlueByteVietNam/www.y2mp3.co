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
