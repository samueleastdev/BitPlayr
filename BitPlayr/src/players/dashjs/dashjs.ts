import dashjs, { MediaInfo, MediaType } from 'dashjs';
import { BasePlayerStrategy } from '../../core/basePlayerStrategy';
import { WithTelemetry } from '../../telementry/decorators';
import { IVideoService } from '../../core/interfaces/ICommon';
import { IQualityLevel } from '../interfaces/IBitrates';
import { DashJsTrackChangeEvent, ITrack, ITracks } from '../interfaces/ITracks';
import { IConfig, IGlobalConfig } from '../../configs/interfaces/IConfigs';

export class DashJsStrategy extends BasePlayerStrategy {
  private player!: dashjs.MediaPlayerClass;
  private playerConfig: any;
  private globalConfig: IGlobalConfig;
  private qualityLevels: IQualityLevel[];

  constructor(config: IConfig) {
    super();
    this.playerConfig = config.dash;
    this.globalConfig = config.global;
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

    this.player = dashjs.MediaPlayer().create();
    this.player.updateSettings(this.playerConfig);
    this.logger.info(`DASH PlayerConfig:`, this.playerConfig);
  }

  @WithTelemetry
  load(provider: IVideoService): void {
    this.player.initialize(this.videoElement, provider.manifestUrl, true);
    const ttmlDiv = document.getElementById('ttml-rendering-div') as HTMLDivElement;
    if (ttmlDiv) {
      this.player.attachTTMLRenderingDiv(ttmlDiv);
    }
  }

  onManifestAvailable(callback: (event: any) => void): void {
    this.player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, (e) => {
      this.logger.info(`Manifest has been loaded:`, e.data);
      callback(e.data);
    });
  }

  onTracks(callback: (tracks: ITracks) => void): void {
    this.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const subtitles = this.player.getTracksFor('text').map(this.mapTrack);
      const audio = this.player.getTracksFor('audio').map(this.mapTrack);

      callback({ subtitles, audio });
    });
  }

  onTrackChanged(callback: (data: ITrack) => void): void {
    this.player.on(dashjs.MediaPlayer.events.TRACK_CHANGE_RENDERED, (e) => {
      const event = e as unknown as DashJsTrackChangeEvent; // Type assertion
      const track = event.newMediaInfo ?? undefined;

      if (track) {
        callback({
          index: track.index,
          type: track.type,
          lang: track.lang,
          roles: track.roles,
          labels: track.labels,
          codec: track.codec,
          mimeType: track.mimeType,
        });
      }
    });
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

  onQualityLevels(callback: (data: IQualityLevel[]) => void): void {
    this.player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const bitrates = this.player.getBitrateInfoListFor('video');
      this.qualityLevels = bitrates.map((b) => ({
        index: b.qualityIndex,
        bitrate: b.bitrate,
        width: b.width,
        height: b.height,
        name: `${b.scanType} ${b.mediaType}`,
      }));
      callback(this.qualityLevels);
    });
  }

  onQualityChange(callback: (event: IQualityLevel) => void): void {
    this.player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_RENDERED, (e) => {
      if (e.mediaType === 'video') {
        const currentLevel = this.qualityLevels[e.newQuality];
        callback(currentLevel);
      }
    });
  }

  setQuality(level: IQualityLevel) {
    console.log('setQuality!!!!@@@', level);
    this.player.setQualityFor('video', 1);
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
