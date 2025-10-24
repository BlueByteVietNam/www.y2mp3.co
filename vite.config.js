import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'api.y2mp3.co',
      'b82ebb9043bb.ngrok-free.app'
    ],
    proxy: {
      // If you need to proxy API requests, configure them here
    }
  },
  preview: {
    allowedHosts: [
      'test.y2mp3.co',
      'b82ebb9043bb.ngrok-free.app'
    ]
  }
});
