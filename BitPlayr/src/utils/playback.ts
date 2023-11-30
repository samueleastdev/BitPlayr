export function supportsMediaSource() {
  return !!window.MediaSource;
}

export function checkMediaType(url: string): string | null {
  const supportedExtensions = ['.m3u8', '.mpd', '.mp4'];
  const urlWithoutParams = url.split('?')[0].toLowerCase();

  for (const ext of supportedExtensions) {
    if (urlWithoutParams.endsWith(ext)) {
      if (ext === '.m3u8') {
        return 'Dash HLS';
      } else if (ext === '.mpd') {
        return 'Dash MPD';
      } else if (ext === '.mp4') {
        return 'MP4';
      }
    }
  }

  return null; // Unsupported media type
}

export function HFormatTime(timeInSeconds: number) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
