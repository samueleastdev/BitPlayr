import { IPlayerExtension, Player } from 'bitplayr';


export class TestPlugin implements IPlayerExtension {
  apply(player: Player) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(currentTime: number) {
    console.log('TestPlugin', currentTime);
  }
}