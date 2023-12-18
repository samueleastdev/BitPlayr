import Hls, { MediaPlaylist } from 'hls.js';
import { BasePlayer } from '../base/base-player';
import { IDeviceDetails } from '../../device/common/common';
import { IPlayerConfig } from '../../configs/interfaces/configs';
import { WithTelemetry } from '../../telementry/decorators';
import { IQualityLevel, ITrack } from '../interfaces/tracks';
import { IVideoService } from '../../service/interfaces/common';
import { VideoEvents } from '../common/common';

export class HlsPlayer extends BasePlayer {
  private player!: Hls;
  private qualityLevels: IQualityLevel[];

  constructor(
    videoElement: HTMLMediaElement,
    playerConfig: IPlayerConfig,
    deviceInfo: IDeviceDetails,
  ) {
    super(videoElement, playerConfig, deviceInfo);
    this.qualityLevels = [];
    this.initialize();
  }

  @WithTelemetry
  protected initialize(): void {
    this.logger.info(`Initializing HLS Player: ${this.videoElement}`);

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${this.videoElement}' not found.`);
      throw new Error(`Element with ID '${this.videoElement}' not found.`);
    }

    if (Hls.isSupported()) {
      this.player = new Hls(this.playerConfig.hls);
      this.logger.info(`HLS PlayerConfig:`, this.playerConfig.hls);
      this.player.attachMedia(this.videoElement);

      Object.values(VideoEvents).forEach((event: VideoEvents) => {
        this.videoElement.addEventListener(event, this.emit.bind(this, event));
      });

      this.player.on(Hls.Events.MANIFEST_LOADED, this.getQualityLevels.bind(this));
      this.player.on(Hls.Events.LEVEL_LOADED, this.getTracks.bind(this));
    } else {
      this.logger.error('HLS is not supported');
    }
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player.loadSource(provider.manifestUrl);
  }

  collectStats() {
    return {
      vst: '',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQualityLevels(event: any, data: any) {
    this.qualityLevels = data.levels;

    const levels = data.levels.map((b: IQualityLevel) => ({
      index: b.index,
      bitrate: b.bitrate,
      width: b.width,
      height: b.height,
      name: `${b.width} ${b.height}`,
    }));
    this.emit('qualityLevels', levels);
  }

  setQuality(level: IQualityLevel) {
    const matchedLevel = this.qualityLevels.findIndex(
      (track) => track.width === level.width && track.height === level.height,
    );

    if (matchedLevel !== -1) {
      this.player.currentLevel = matchedLevel;
    } else {
      this.logger.info(`setQuality match not found.`);
    }
  }

  getTracks() {
    const subtitles = this.player.subtitleTracks.map(this.mapTrack);
    const audio = this.player.audioTracks.map(this.mapTrack);
    this.emit('tracks', { subtitles, audio });
  }

  setTrack(track: ITrack) {
    if (!track.type || track.id == null) {
      this.logger.info(`Invalid track data: ${track}`);
      return;
    }

    const trackType = track.type.toLowerCase();

    switch (trackType) {
      case 'subtitles':
        this.player.subtitleTrack = track.id;
        break;
      case 'audio':
        this.player.audioTrack = track.id;
        break;
      default:
        this.logger.info(`Invalid track type: ${track.type}`);
    }
  }

  private mapTrack(track: MediaPlaylist): ITrack {
    return {
      id: track.id,
      type: track.type,
      lang: track.lang ?? '',
      name: track.name,
      default: track.default,
      autoselect: track.autoselect,
      forced: track.forced,
    };
  }
}
