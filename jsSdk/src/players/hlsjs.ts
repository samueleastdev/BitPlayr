import Hls from 'hls.js';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';

export class HlsJsStrategy extends BasePlayerStrategy {
  private hlsPlayer!: Hls;

  @WithTelemetry
  initialize(videoElementId: string, streamUrl: string) {
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    if (Hls.isSupported()) {
      this.hlsPlayer = new Hls();
      this.hlsPlayer.loadSource(streamUrl);
      this.hlsPlayer.attachMedia(this.videoElement);
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = streamUrl;
    }
  }
}
