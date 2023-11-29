import Hls from 'hls.js';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';
import { SDKLogger } from '../logger/logger';
import { SdkConfig } from '../core/configs/sdkConfig';
import { IVideoService } from '../core/interfaces/ICommon';

export class HlsJsStrategy extends BasePlayerStrategy {
  private hlsPlayer!: Hls;
  private logger: SDKLogger;
  private playerConfig: any;

  constructor(playerConfig: any) {
    super();
    this.logger = new SDKLogger(SdkConfig.getConfig().logLevel);
    this.playerConfig = playerConfig;
  }

  @WithTelemetry
  init(videoElementId: string, provider: IVideoService): void {
    this.logger.info(`Initializing with videoElementId: ${videoElementId}`);
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${videoElementId}' not found.`);
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    if (Hls.isSupported()) {
      this.hlsPlayer = new Hls(this.playerConfig);
      this.logger.info(`HLS PlayerConfig:`, this.playerConfig);
      this.hlsPlayer.loadSource(provider.manifestUrl);
      this.hlsPlayer.attachMedia(this.videoElement);
    } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoElement.src = provider.manifestUrl;
    }
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.hlsPlayer.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
      callback(data);
    });
  }
}
