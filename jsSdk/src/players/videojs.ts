import videojs from 'video.js';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';

export class VideoJsStrategy extends BasePlayerStrategy {
  // eslint-disable-next-line
  private videoPlayer!: videojs.Player;

  @WithTelemetry
  initialize(videoElementId: string, streamUrl: string) {
    this.videoElement = document.getElementById(videoElementId) as HTMLVideoElement;

    if (!this.videoElement) {
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    this.videoPlayer = videojs(this.videoElement);
    this.videoPlayer.src({ type: 'video/mp4', src: streamUrl }); // Update based on your video format
  }
}
