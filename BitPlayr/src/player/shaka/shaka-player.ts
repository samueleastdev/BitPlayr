import shaka from 'shaka-player';
import { BasePlayer } from '../base/base-player';
import { IDeviceDetails } from '../../device/common/common';
import { IPlayerConfig } from '../../configs/interfaces/configs';
import { WithTelemetry } from '../../telementry/decorators';
import { IQualityLevel, ITrack } from '../interfaces/tracks';
import { IVideoService } from '../../service/interfaces/common';
import { VideoEvents } from '../common/common';

export class ShakaPlayer extends BasePlayer {
  private player!: shaka.Player;

  constructor(
    videoElement: HTMLMediaElement,
    playerConfig: IPlayerConfig,
    deviceInfo: IDeviceDetails,
  ) {
    super(videoElement, playerConfig, deviceInfo);
    this.initialize();
  }

  @WithTelemetry
  protected async initialize(): Promise<void> {
    this.validateVideoElement();

    shaka.polyfill.installAll();
    this.player = new shaka.Player();
    await this.player.attach(this.videoElement);

    this.player.configure(this.playerConfig);
    this.logger.info(`Shaka PlayerConfig:`, this.playerConfig);

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
    Object.values(VideoEvents).forEach((event) =>
      this.videoElement.addEventListener(event, this.emit.bind(this, event)),
    );

    this.player.addEventListener('loaded', this.getQualityLevels.bind(this));
    this.player.addEventListener('loaded', this.getTracks.bind(this));
    this.player.addEventListener('error', this.handleError.bind(this));
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player
      .load(provider.manifestUrl, this.playerConfig.global.startTime)
      .then(() => {
        this.logger.info('The video has been loaded successfully!');
      })
      .catch((e) => {
        this.emit('error', {
          type: 'Player',
          message: JSON.stringify(e),
        });
      });
  }

  handleError(event: Event) {
    const error = event as unknown as { detail: shaka.util.Error };

    let type = 'Player';

    if (error.detail && error.detail.category === shaka.util.Error.Category.DRM) {
      type = 'DRM';
    }

    this.emit('error', {
      type: type,
      message: JSON.stringify(error.detail),
    });
  }

  collectStats() {
    return {
      vst: '',
    };
  }

  getQualityLevels() {
    const levels = this.getUniqueVideoQualityLevels().map(this.mapQualityLevel);
    this.emit('qualityLevels', levels);
  }

  setQuality(level: IQualityLevel) {
    console.log('level', level);
    const tracks = this.player.getVariantTracks();
    const matchedTrack = tracks.find(
      (track: shaka.extern.Track) => track.width === level.width && track.height === level.height,
    );

    if (matchedTrack) {
      this.player.configure({ abr: { enabled: false } });
      this.player.selectVariantTrack(matchedTrack, /* clearBuffer */ true);
    } else {
      this.logger.info(`setQuality match not found.`);
    }
  }

  getTracks() {
    const subtitles = this.player.getTextTracks().map(this.mapTrack);
    this.emit('tracks', { subtitles });
  }

  setTrack(track: ITrack) {
    if (!track.type || track.id == null) {
      this.logger.info(`Invalid track data: ${track}`);
      return;
    }

    const trackType = track.type.toLowerCase();
    const tracks = this.player.getVariantTracks().concat(this.player.getTextTracks());

    const selectedTrack = tracks.find((t: shaka.extern.Track) => t.id === track.id);
    if (!selectedTrack) {
      this.logger.info(`Track not found: ${track.id}`);
      return;
    }

    if (trackType === 'text') {
      this.player.setTextTrackVisibility(true);
      this.player.selectTextTrack(selectedTrack);
    } else {
      this.player.selectVariantTrack(selectedTrack, /* clearBuffer */ true);
    }
  }

  private mapQualityLevel(track: shaka.extern.Track): IQualityLevel {
    return {
      id: track.id,
      bitrate: track.bandwidth,
      name: `${track.id} / ${track.bandwidth}`,
      width: track.width ?? 0,
      height: track.height ?? 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapTrack(track: any): ITrack {
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

  private getUniqueVideoQualityLevels() {
    const tracks = this.player.getVariantTracks();
    const uniqueTracks = new Map();

    tracks.forEach((track: shaka.extern.Track) => {
      const resolutionKey = track.height;

      if (
        !uniqueTracks.has(resolutionKey) ||
        uniqueTracks.get(resolutionKey).bandwidth < track.bandwidth
      ) {
        uniqueTracks.set(resolutionKey, track);
      }
    });

    return Array.from(uniqueTracks.values());
  }
}
