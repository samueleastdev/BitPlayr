import { EventEmitter } from 'events';
import { IPlayerStrategy } from '../players/interfaces/IPlayers';
import { IVideoService } from './interfaces/ICommon';

export class Player extends EventEmitter {
  private playerStrategy: IPlayerStrategy;
  private videoElementId: string;

  constructor(playerStrategy: IPlayerStrategy, videoElementId: string) {
    super();
    this.playerStrategy = playerStrategy;
    this.videoElementId = videoElementId;
  }

  initialize(provider: IVideoService): void {
    this.playerStrategy.init(this.videoElementId, provider);
    this.emit('initialize', true);
    this.playerStrategy.onTimeUpdate((time) => this.emit('timeupdate', time));
    this.playerStrategy.onSeeked((time) => this.emit('seeked', time));
    this.playerStrategy.onManifestAvailable((event) => this.emit('manifestAvailable', event));
    this.playerStrategy.onLoadedMetadata((event) => this.emit('loadedmetadata', event));
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
}
