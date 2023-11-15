import { EventEmitter } from 'events';
import { IPlayerStrategy } from '../players/interfaces/iPlayers';

export class Player extends EventEmitter {
  private playerStrategy: IPlayerStrategy;

  constructor(playerStrategy: IPlayerStrategy) {
    super();
    this.playerStrategy = playerStrategy;
  }

  initialize(videoElementId: string, streamUrl: string) {
    this.playerStrategy.initialize(videoElementId, streamUrl);
    this.playerStrategy.onTimeUpdate((time) => this.emit('timeupdate', time));
    this.playerStrategy.onSeeked((time) => this.emit('seeked', time));
  }

  play() {
    this.playerStrategy.play();
  }

  pause() {
    this.playerStrategy.pause();
  }

  fullscreen() {
    this.playerStrategy.fullscreen();
  }
}
