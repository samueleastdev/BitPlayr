import { Player } from '../../core/basePlayer';
import { IPlayerExtension } from '../interfaces/common';

export class ThumbnailExtension implements IPlayerExtension {
  apply(player: Player) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(currentTime: number) {
    // Logic to handle the time update...
    //console.log('ThumbnailPlugin', currentTime);
  }
}
