import { Player } from '../../core/basePlayer';
import { IPlayerPlugin } from '../interfaces/common';

export class ThumbnailPlugin implements IPlayerPlugin {
  apply(player: Player) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(currentTime: number) {
    // Logic to handle the time update...
    //console.log('ThumbnailPlugin', currentTime);
  }
}
