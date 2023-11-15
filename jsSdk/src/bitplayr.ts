import { Player } from './core/basePlayer';
import { SdkConfigService } from './core/sdkConfig';
import { DashJsStrategy } from './players/dashjs';
import { HlsJsStrategy } from './players/hlsjs'; // Import if you're using HlsJsStrategy
import { IPlayerStrategy } from './players/interfaces/iPlayers';
import { VideoJsStrategy } from './players/videojs';
import { PlayerConfig } from './plugins/interfaces/common';

export class BitPlayrFactory {
  static createPlayer(config: PlayerConfig): Player {
    SdkConfigService.setConfig(config.sdkConfig);
    const strategy = BitPlayrFactory.getStrategy(config.player);
    const player = new Player(strategy);

    config.plugins.forEach((plugin) => {
      plugin.apply(player);
    });

    return player;
  }

  private static getStrategy(playerType: string): IPlayerStrategy {
    switch (playerType) {
      case 'hls.js':
        return new HlsJsStrategy();
      case 'dash.js':
        return new DashJsStrategy();
      case 'video.js':
        return new VideoJsStrategy();
      default:
        throw new Error(`Unsupported player type: ${playerType}`);
    }
  }
}
