import dashjs from 'dashjs';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';
import { VProvider } from '../extensions/interfaces/common';
import { SDKLogger } from '../logger/logger';
import { SdkConfig } from '../core/configs/sdkConfig';

export class DashJsStrategy extends BasePlayerStrategy {
  private dashPlayer!: dashjs.MediaPlayerClass;
  private logger: SDKLogger;
  private playerConfig: any;

  constructor(playerConfig: any) {
    super();
    this.logger = new SDKLogger(SdkConfig.getConfig().logLevel);
    this.playerConfig = playerConfig;
  }

  @WithTelemetry
  init(videoElementId: string, provider: VProvider): void {
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${videoElementId}' not found.`);
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }

    this.dashPlayer = dashjs.MediaPlayer().create();
    this.dashPlayer.updateSettings(this.playerConfig);
    this.logger.info(`DASH PlayerConfig:`, this.playerConfig);
    this.dashPlayer.initialize(this.videoElement, provider.manifestUrl, true);
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.dashPlayer.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, (e) => {
      this.logger.info(`Manifest has been loaded:`, e.data);
      callback(e.data);
    });
  }
}
