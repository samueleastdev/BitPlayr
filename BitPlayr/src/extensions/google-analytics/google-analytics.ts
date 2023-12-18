import { BasePlayer } from '../../player/base/base-player';
import { TimeUpdateEvent } from '../../player/common/common';
import { IPlayerExtension } from '../interfaces/common';

export class GoogleAnalyticsExtension implements IPlayerExtension {
  apply(player: BasePlayer) {
    player.on('timeupdate', this.handleTimeUpdate);
    player.on('play', this.handlePlay);
    player.on('pause', this.handlePause);
  }

  handlePlay() {
    console.log('play called:');
  }

  handlePause() {
    console.log('pause called:');
  }

  handleTimeUpdate(event: TimeUpdateEvent) {
    //console.log('GoogleAnalyticsExtension: ', event);
  }
}
