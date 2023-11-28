import { supportsMediaSource } from './playback';

function supportsCodec(codecString: string) {
  if (window.MediaSource && typeof window.MediaSource.isTypeSupported === 'function') {
    return window.MediaSource.isTypeSupported(codecString);
  }
  return false;
}

export function supportsDashPlayback() {
  return supportsMediaSource() && supportsCodec('video/mp4; codecs="avc1.42E01E"');
}
