// API Configuration
export const API_URL = "https://sv-190.y2mp3.co/"
export const AUTH_TOKEN = '';

// Audio download defaults (follows backend schema strictly)
export const AUDIO_DEFAULTS = {
  downloadMode: "audio",
  filenameStyle: "basic",
  audioFormat: "mp3",
  audioBitrate: "128",
  youtubeBetterAudio: false,
  disableMetadata: false
};

// Video download defaults (follows backend schema strictly)
export const VIDEO_DEFAULTS = {
  downloadMode: "video",
  filenameStyle: "basic",
  videoQuality: "1080",
  youtubeVideoCodec: "h264",
  youtubeVideoContainer: "mp4",
  youtubeBetterAudio: false,
  youtubeHLS: false,
  disableMetadata: false
};

// Available options for selectors
export const OPTIONS = {
  audioFormat: ["best", "mp3", "ogg", "wav", "opus"],
  audioBitrate: ["320", "256", "128", "96", "64", "8"],
  videoQuality: ["max", "4320", "2160", "1440", "1080", "720", "480", "360", "240", "144"],
  youtubeVideoCodec: ["h264", "av1", "vp9"],
  youtubeVideoContainer: ["auto", "mp4", "webm", "mkv"],
  filenameStyle: ["classic", "pretty", "basic", "nerdy"]
};
