import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'api.y2mp3.co'
    ],
    proxy: {
      // If you need to proxy API requests, configure them here
    }
  },
  preview: {
    allowedHosts: [
      'test.y2mp3.co'
    ]
  }
});
