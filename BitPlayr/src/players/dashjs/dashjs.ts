import dashjs from 'dashjs';
import { BasePlayerStrategy } from '../../core/basePlayerStrategy';
import { WithTelemetry } from '../../telementry/decorators';
import { IVideoService } from '../../core/interfaces/ICommon';

export class DashJsStrategy extends BasePlayerStrategy {
  private dashPlayer!: dashjs.MediaPlayerClass;
  private playerConfig: any;

  constructor(playerConfig: any) {
    super();
    this.playerConfig = playerConfig;
  }

  @WithTelemetry
  createPlayer(videoElementId: string) {
    this.logger.info(`Initializing with videoElementId: ${videoElementId}`);
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${videoElementId}' not found.`);
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    this.dashPlayer = dashjs.MediaPlayer().create();
    this.dashPlayer.updateSettings(this.playerConfig);
    this.logger.info(`DASH PlayerConfig:`, this.playerConfig);
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.dashPlayer.initialize(this.videoElement, provider.manifestUrl, true);
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.dashPlayer.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, (e) => {
      this.logger.info(`Manifest has been loaded:`, e.data);
      callback(e.data);
    });
  }
}
