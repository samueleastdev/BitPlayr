import Hls from 'hls.js';
import { BasePlayerStrategy } from '../../core/basePlayerStrategy';
import { WithTelemetry } from '../../telementry/decorators';
import { IVideoService } from '../../core/interfaces/ICommon';

export class HlsJsStrategy extends BasePlayerStrategy {
  private player!: Hls;
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

    if (Hls.isSupported()) {
      this.player = new Hls(this.playerConfig);
      this.logger.info(`HLS PlayerConfig:`, this.playerConfig);
      this.player.attachMedia(this.videoElement);
    }
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player.loadSource(provider.manifestUrl);
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.player.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
      callback(data);
    });
  }
}
