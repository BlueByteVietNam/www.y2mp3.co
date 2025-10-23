// Validate YouTube URL
export function isYouTubeURL(url) {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/.+/
  ];
  return patterns.some(pattern => pattern.test(url));
}
