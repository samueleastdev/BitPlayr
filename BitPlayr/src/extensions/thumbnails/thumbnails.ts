import { BasePlayer } from '../../player/base/base-player';
import { IPlayerExtension } from '../interfaces/common';

export class ThumbnailsExtension implements IPlayerExtension {
  apply(player: BasePlayer) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(/*event: TimeUpdateEvent*/) {}
}
