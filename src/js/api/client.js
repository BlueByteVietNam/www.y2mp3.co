import { API_URL, AUTH_TOKEN } from '../config.js';

/**
 * Call API to get download URL with custom options
 * @param {string} url - YouTube URL
 * @param {Object} options - Download options matching backend schema
 * @returns {Promise<Object>} API response
 */
export async function getDownloadURL(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (AUTH_TOKEN && AUTH_TOKEN !== '') {
    headers['Authorization'] = `Api-Key ${AUTH_TOKEN}`;
  }

  // Build request body - only include provided options
  const body = {
    url,
    ...options
  };

  console.log('API Request:', body);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();
  console.log('API Response:', result);

  return result;
}
