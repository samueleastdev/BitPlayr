import shaka from 'shaka-player';
import { BasePlayerStrategy } from '../../core/basePlayerStrategy';
import { IVideoService } from '../../core/interfaces/ICommon';
import { IQualityLevel } from '../interfaces/IBitrates';
import { ITrack, ITracks } from '../interfaces/ITracks';
import { WithTelemetry } from '../../telementry/decorators';
import { IConfig, IGlobalConfig } from '../../configs/interfaces/IConfigs';

export class ShakaStrategy extends BasePlayerStrategy {
  private player!: shaka.Player;
  private playerConfig: any;
  private globalConfig: IGlobalConfig;
  private audioTracks: ITrack[];
  private subtitleTracks: ITrack[];
  private qualityLevels: IQualityLevel[];

  constructor(config: IConfig) {
    super();
    this.playerConfig = config.shaka;
    this.globalConfig = config.global;
    this.audioTracks = [];
    this.subtitleTracks = [];
    this.qualityLevels = [];
  }

  @WithTelemetry
  createPlayer(videoElementId: string) {
    this.logger.info(`Initializing with videoElementId: ${videoElementId}`);
    this.videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    if (!this.videoElement) {
      this.logger.error(`Element with ID '${videoElementId}' not found.`);
      throw new Error(`Element with ID '${videoElementId}' not found.`);
    }
    shaka.polyfill.installAll();
    this.player = new shaka.Player(this.videoElement);
    //await this.player.attach(this.videoElement);

    this.player.configure(this.playerConfig);
    this.logger.info(`Shaka PlayerConfig:`, this.playerConfig);
    this.player.addEventListener('trackschanged', () => this.setTracksChanged());
  }

  private setTracksChanged() {
    if (this.globalConfig.preferredLanguage && this.globalConfig.preferredLanguage.trim() !== '') {
      const textTracks = this.player.getTextTracks();

      const trackToSelect = textTracks.find(
        (track) => track.language === this.globalConfig.preferredLanguage,
      );
      if (trackToSelect) {
        this.player.selectTextTrack(trackToSelect);
        this.player.setTextTrackVisibility(true);
      } else {
        console.log(`No text track found for language: ${this.globalConfig.preferredLanguage}`);
      }
    } else {
      console.log('Preferred language not set or is empty');
    }
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player
      .load(provider.manifestUrl, this.globalConfig.startTime)
      .then(function () {
        console.log('The video has been loaded successfully!');
      })
      .catch(() => {
        console.log('ERROR');
      });
  }

  onManifestAvailable(callback: (data: any) => void): void {
    this.player.addEventListener('loaded', () => {
      this.logger.info(`Manifest has been loaded`);
      callback({});
    });
  }

  onTracks(callback: (event: ITracks) => void): void {
    this.player.addEventListener('loaded', () => {
      const subtitles = this.player.getTextTracks().map(this.mapTrack);
      callback({ subtitles });
    });
  }

  onTrackChanged(callback: (data: ITrack) => void): void {
    this.player.addEventListener('trackschanged', () => {
      console.log('Track Changed');
      callback({
        id: 2,
        type: 'wc',
        lang: 'E',
        name: '',
      });
    });
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

  onQualityLevels(callback: (data: IQualityLevel[]) => void): void {
    this.player.addEventListener('loaded', () => {
      const levels = this.getUniqueVideoQualityLevels().map(this.mapQualityLevel);
      callback(levels);
    });
  }

  onQualityChange(callback: (data: IQualityLevel) => void): void {}

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

  private mapTrack(track: shaka.extern.Track): ITrack {
    return {
      id: track.id,
      type: track.type,
      lang: track.language ?? '',
      name: track.label,
      forced: track.forced,
    };
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

  private getUniqueVideoQualityLevels() {
    const tracks = this.player.getVariantTracks();
    const uniqueTracks = new Map();

    tracks.forEach((track) => {
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
