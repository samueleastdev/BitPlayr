import { BasePlayer } from '../../player/base/BasePlayer';
import { IPlayerExtension } from '../interfaces/ICommon';

export class ThumbnailsExtension implements IPlayerExtension {
  apply(player: BasePlayer) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(/*event: TimeUpdateEvent*/) {}
}
