// API Configuration
export const API_URL = "http://test.y2mp3.co:9000/";
export const AUTH_TOKEN = '';

// Default request configurations
export const AUDIO_CONFIG = {
  downloadMode: "audio",
  filenameStyle: "basic",

  // Audio settings
  audioFormat: "mp3",
  audioBitrate: "128",

  // YouTube audio
  youtubeBetterAudio: false,

  // Video settings (not used but sent for consistency)
  videoQuality: "1080",
  youtubeVideoCodec: "h264",
  youtubeVideoContainer: "mp4",
  youtubeHLS: false,

  // Other
  disableMetadata: false,
  allowH265: false,
  convertGif: true,
  tiktokFullAudio: false,
  alwaysProxy: false,
  localProcessing: "disabled"
};

export const VIDEO_CONFIG = {
  downloadMode: "auto",
  filenameStyle: "basic",

  // Audio settings
  audioFormat: "mp3",
  audioBitrate: "128",

  // YouTube audio
  youtubeBetterAudio: false,

  // Video settings
  videoQuality: "1080",
  youtubeVideoCodec: "h264",
  youtubeVideoContainer: "mp4",
  youtubeHLS: false,

  // Other
  disableMetadata: false,
  allowH265: false,
  convertGif: true,
  tiktokFullAudio: false,
  alwaysProxy: false,
  localProcessing: "disabled"
};
