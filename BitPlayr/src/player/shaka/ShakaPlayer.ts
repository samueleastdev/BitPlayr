import shaka from 'shaka-player';
import { BasePlayer } from '../base/BasePlayer';
import { IDeviceDetails } from '../../device/common/ICommon';
import { IPlayerConfig } from '../../configs/interfaces/IConfigs';
import { WithTelemetry } from '../../telementry/decorators';
import { IQualityLevel, ITrack } from '../interfaces/ITracks';
import { IVideoService } from '../../service/interfaces/ICommon';

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
    this.logger.info(`Initializing Shaka Player: ${this.videoElement}`);

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${this.videoElement}' not found.`);
      throw new Error(`Element with ID '${this.videoElement}' not found.`);
    }

    shaka.polyfill.installAll();
    this.player = new shaka.Player();
    await this.player.attach(this.videoElement);

    this.player.configure(this.playerConfig);
    this.logger.info(`Shaka PlayerConfig:`, this.playerConfig);
    this.videoElement.addEventListener('loadedmetadata', this.emit.bind(this, 'loadedmetadata'));
    this.videoElement.addEventListener('timeupdate', this.emit.bind(this, 'timeupdate'));
    this.player.addEventListener('loaded', this.getQualityLevels.bind(this));
    this.player.addEventListener('loaded', this.getTracks.bind(this));
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player
      .load(provider.manifestUrl, this.playerConfig.global.startTime)
      .then(function () {
        console.log('The video has been loaded successfully!');
      })
      .catch(() => {
        console.log('ERROR');
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
