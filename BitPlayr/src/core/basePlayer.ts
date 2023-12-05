import { EventEmitter } from 'events';
import { IPlayerStrategy } from '../players/interfaces/IPlayers';
import { IVideoService } from './interfaces/ICommon';
import { ITrack } from '../players/interfaces/ITracks';
import { ILevelParsed } from '../players/interfaces/IBitrates';

export class Player extends EventEmitter {
  private playerStrategy: IPlayerStrategy;
  private videoElementId: string;

  constructor(playerStrategy: IPlayerStrategy, videoElementId: string) {
    super();
    this.videoElementId = videoElementId;
    this.playerStrategy = playerStrategy;
    this.playerStrategy.createPlayer(videoElementId);
    this.attachEvents();
  }

  attachEvents() {
    this.playerStrategy.onTimeUpdate((time) => this.emit('timeupdate', time));
    this.playerStrategy.onSeeked((time) => this.emit('seeked', time));
    this.playerStrategy.onManifestAvailable((event) => this.emit('manifestAvailable', event));

    this.playerStrategy.onQualityChange((event) => this.emit('qualityChange', event));
    this.playerStrategy.onQualityLevels((event) => this.emit('qualityLevels', event));

    this.playerStrategy.onTracks((event) => this.emit('tracks', event));
    this.playerStrategy.onTrackChanged((event) => this.emit('trackChanged', event));

    this.playerStrategy.onLoadedMetadata((event) => this.emit('loadedmetadata', event));
  }

  initialize(provider: IVideoService): void {
    this.playerStrategy.load(provider);
  }

  getVideoElementId(): string {
    return this.videoElementId;
  }

  async play(): Promise<void> {
    return this.playerStrategy.play();
  }

  pause(): void {
    this.playerStrategy.pause();
  }

  fullscreen(): void {
    this.playerStrategy.fullscreen();
  }

  seekTo(time: number): void {
    this.playerStrategy.seekTo(time);
  }

  setQuality(level: ILevelParsed) {
    this.playerStrategy.setQuality(level);
  }

  setTrack(track: ITrack) {
    this.playerStrategy.setTrack(track);
  }
}
