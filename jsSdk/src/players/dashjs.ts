import dashjs from 'dashjs';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';

export class DashJsStrategy extends BasePlayerStrategy {
  private dashPlayer!: dashjs.MediaPlayerClass;

  @WithTelemetry
  initialize(videoElementId: string, streamUrl: string) {
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    this.dashPlayer = dashjs.MediaPlayer().create();
    this.dashPlayer.initialize(this.videoElement, streamUrl, true);
  }
}
