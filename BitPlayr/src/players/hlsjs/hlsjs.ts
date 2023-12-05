import Hls, { MediaPlaylist } from 'hls.js';
import { BasePlayerStrategy } from '../../core/basePlayerStrategy';
import { WithTelemetry } from '../../telementry/decorators';
import { IVideoService } from '../../core/interfaces/ICommon';
import { ILevelParsed } from '../interfaces/IBitrates';
import { ITrack, ITracks } from '../interfaces/ITracks';

export class HlsJsStrategy extends BasePlayerStrategy {
  private player!: Hls;
  private playerConfig: any;
  private audioTracks: ITrack[];
  private subtitleTracks: ITrack[];
  private qualityLevels: ILevelParsed[];

  constructor(playerConfig: any) {
    super();
    this.playerConfig = playerConfig;
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

  onManifestAvailable(callback: (data: any) => void): void {
    this.player.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
      console.log('data', data);
      callback(data);
    });
  }

  onTracks(callback: (event: ITracks) => void): void {
    this.player.on(Hls.Events.LEVEL_LOADED, () => {
      const subtitles = this.player.subtitleTracks.map(this.mapTrack);
      const audio = this.player.audioTracks.map(this.mapTrack);
      callback({ subtitles, audio });
    });
  }

  onTrackChanged(callback: (data: ITrack) => void): void {
    this.player.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (event, data) => {
      this.handleTrackChange(data.id, 'subtitle', callback);
    });
    this.player.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
      this.handleTrackChange(data.id, 'audio', callback);
    });
  }

  setTrack(track: ITrack) {
    if (!track.type || track.id == null) {
      console.log(`Invalid track data: ${track}`);
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
        console.log(`Invalid track type: ${track.type}`);
    }
  }

  onQualityLevels(callback: (data: ILevelParsed[]) => void): void {
    this.player.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
      console.log('data.levels', data.levels);
      this.qualityLevels = data.levels;
      callback(data.levels);
    });
  }

  onQualityChange(callback: (data: ILevelParsed) => void): void {
    this.player.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      const currentLevel = this.qualityLevels[data.level];
      callback(currentLevel);
    });
  }

  setQuality(level: ILevelParsed) {
    const matchedLevel = this.qualityLevels.findIndex(
      (track) => track.width === level.width && track.height === level.height,
    );

    if (matchedLevel !== -1) {
      this.player.currentLevel = matchedLevel;
    } else {
      console.log('No match found');
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

  private handleTrackChange(trackId: number, trackType: string, callback: (data: ITrack) => void) {
    let track;
    if (trackType === 'subtitle') {
      track = this.player.subtitleTracks[trackId];
    } else if (trackType === 'audio') {
      track = this.player.audioTracks[trackId];
    }

    if (track) {
      callback({
        id: track.id,
        type: track.type,
        lang: track.lang ?? '',
        name: track.name,
        default: track.default,
        autoselect: track.autoselect,
        forced: track.forced,
      });
    }
  }
}
