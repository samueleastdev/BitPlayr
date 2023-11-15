import { IPlayerPlugin, Player } from 'bitplayr';


export class TestPlugin implements IPlayerPlugin {
  apply(player: Player) {
    player.on('timeupdate', this.handleTimeUpdate);
  }

  handleTimeUpdate(currentTime: number) {
    console.log('TestPlugin', currentTime);
  }
}