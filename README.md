# y2mp3 - YouTube Downloader (Web V3)

Simple, lightweight YouTube downloader built with Vite + Vanilla JS.

## Features

- 🎵 Download YouTube audio as MP3 (128kbps)
- 🎬 Download YouTube video (1080p H264)
- 🚀 Fast & simple UI
- 🔒 Token-based authentication
- ⚡ Built with Vite for instant HMR

## Structure

```
web_v3/
├── index.html              # Entry HTML
├── package.json
└── src/
    ├── main.js             # App initialization
    ├── config.js           # API & default configs
    ├── api/
    │   └── client.js       # API calls with auth
    ├── ui/
    │   ├── dom.js          # DOM references
    │   └── events.js       # Event handlers
    └── utils/
        └── validate.js     # URL validation
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update auth token in `src/config.js`:
```javascript
export const AUTH_TOKEN = 'your-actual-token-here';
```

3. Update API URL if needed in `src/config.js`:
```javascript
export const API_URL = '/api/json'; // or your API endpoint
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

## Build

```bash
npm run build
```

Output in `dist/` folder.

## Usage

1. Paste YouTube URL
2. Choose Audio (MP3) or Video (1080p)
3. Press Enter or wait
4. Download starts automatically

## Configuration

Default configs in `src/config.js`:

**Audio:**
- Format: MP3
- Bitrate: 128kbps
- Mode: audio

**Video:**
- Quality: 1080p
- Codec: H264
- Container: MP4
- Mode: auto (video + audio)

## Total Code

~250 lines of actual code (excluding HTML/CSS)

## License

Same as parent project
