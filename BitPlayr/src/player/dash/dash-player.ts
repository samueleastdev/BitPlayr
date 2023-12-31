import dashjs, { MediaInfo, MediaType } from 'dashjs';
import { BasePlayer } from '../base/base-player';
import { IDeviceDetails } from '../../device/common/common';
import { IPlayerConfig } from '../../configs/interfaces/configs';
import { WithTelemetry } from '../../telementry/decorators';
import { IQualityLevel, ITrack } from '../interfaces/tracks';
import { IVideoService } from '../../service/interfaces/common';
import { VideoEvents } from '../common/common';

export class DashPlayer extends BasePlayer {
  private player!: dashjs.MediaPlayerClass;

  constructor(
    videoElement: HTMLMediaElement,
    playerConfig: IPlayerConfig,
    deviceInfo: IDeviceDetails,
  ) {
    super(videoElement, playerConfig, deviceInfo);
    this.initialize();
  }

  @WithTelemetry
  protected initialize(): void {
    this.validateVideoElement();

    this.player = dashjs.MediaPlayer().create();
    this.player.updateSettings(this.playerConfig.dash);
    this.logger.info(`DASH PlayerConfig:`, this.playerConfig.dash);

    if (this.playerConfig.dash.drm) {
      this.player.setProtectionData(this.playerConfig.dash.drm);
    }

    this.registerPlayerEvents();
  }

  private validateVideoElement() {
    if (!this.videoElement) {
      const errorMsg = `Element with ID '${this.videoElement}' not found.`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  private registerPlayerEvents() {
    Object.values(VideoEvents).forEach((event: VideoEvents) => {
      this.videoElement.addEventListener(event, this.emit.bind(this, event));
    });

    this.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, this.getQualityLevels.bind(this));
    this.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, this.getTracks.bind(this));
    this.player.on(dashjs.MediaPlayer.events.ERROR, this.handleError.bind(this));
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player.initialize(this.videoElement, provider.manifestUrl, true);
    const ttmlDiv = document.getElementById('ttml-rendering-div') as HTMLDivElement;
    if (ttmlDiv) {
      this.player.attachTTMLRenderingDiv(ttmlDiv);
    }
  }

  handleError(e: dashjs.ErrorEvent): void {
    let type = 'Player';
    if (e.error === 'capability' && e.event === 'mediasource') {
      type = 'DRM';
    }
    this.emit('error', {
      type: type,
      message: JSON.stringify(e),
    });
  }

  collectStats() {
    return {
      vst: '',
    };
  }

  getQualityLevels() {
    const bitrates = this.player.getBitrateInfoListFor('video');

    const levels = bitrates.map((b: IQualityLevel) => ({
      index: b.index,
      bitrate: b.bitrate,
      width: b.width,
      height: b.height,
      name: `${b.width} ${b.height}`,
    }));
    this.emit('qualityLevels', levels);
  }

  setQuality(level: IQualityLevel) {
    console.log('setQuality!!!!@@@', level);
    this.player.setQualityFor('video', 1);
  }

  getTracks() {
    const subtitles = this.player.getTracksFor('text').map(this.mapTrack);
    const audio = this.player.getTracksFor('audio').map(this.mapTrack);

    this.emit('tracks', { subtitles, audio });
  }

  setTrack(track: ITrack) {
    const trackTypes = ['text', 'audio', 'video'];

    if (track.type && trackTypes.includes(track.type)) {
      const selectedTrack = this.player
        .getTracksFor(track.type as MediaType)
        .find((t) => t.index === track.index);

      if (selectedTrack) {
        this.player.setCurrentTrack(selectedTrack);
      } else {
        this.logger.info(`Selected ${track.type} track index exceeds available tracks`);
      }
    } else {
      this.logger.info(`Invalid track type: ${track.type}`);
    }
  }

  private mapTrack(track: MediaInfo): ITrack {
    return {
      index: track.index,
      type: track.type,
      lang: track.lang,
      roles: track.roles,
      labels: track.labels,
      codec: track.codec,
      mimeType: track.mimeType,
    };
  }
}
