import videojs from 'video.js';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';
import { SDKLogger } from '../logger/logger';
import { SdkConfig } from '../core/configs/sdkConfig';
import { IVideoService } from '../core/interfaces/ICommon';

export class VideoJsStrategy extends BasePlayerStrategy {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private videoPlayer!: videojs.Player;
  private logger: SDKLogger;
  private playerConfig: any;

  constructor(playerConfig: any) {
    super();
    this.logger = new SDKLogger(SdkConfig.getConfig().logLevel);
    this.playerConfig = playerConfig;
  }

  @WithTelemetry
  init(videoElementId: string, provider: IVideoService): void {
    this.videoElement = document.getElementById(videoElementId) as HTMLVideoElement;

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${videoElementId}' not found.`);
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    this.videoPlayer = videojs(this.videoElement, this.playerConfig);
    this.logger.info(`VIDEOJS PlayerConfig:`, this.playerConfig);
    this.videoPlayer.src({ src: provider.manifestUrl });
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.videoPlayer.on('hls-manifest-loaded', (e: any) => {
      console.log('Manifest has been loaded', e.data);
      callback(e.data);
    });
  }
}
