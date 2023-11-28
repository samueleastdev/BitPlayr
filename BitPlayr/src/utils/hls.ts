import { supportsMediaSource } from './playback';

function supportsNativeHls() {
  const video = document.createElement('video');
  return (
    video.canPlayType('application/vnd.apple.mpegurl') === 'probably' ||
    video.canPlayType('application/vnd.apple.mpegurl') === 'maybe'
  );
}

export function supportsHlsPlayback() {
  return supportsNativeHls() || supportsMediaSource();
}
