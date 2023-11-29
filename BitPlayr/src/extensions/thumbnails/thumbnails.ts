import { Player } from '../../core/basePlayer';
import { IPlayerExtension } from '../interfaces/ICommon';

export class ThumbnailsExtension implements IPlayerExtension {
  apply(player: Player) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(/*event: TimeUpdateEvent*/) {}
}
