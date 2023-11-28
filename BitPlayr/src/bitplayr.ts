import { Player } from './core/basePlayer';
import { PlayerConfig } from './core/configs/playerConfig';
import { SdkConfig } from './core/configs/sdkConfig';
import { IGlobalConfig, VProvider } from './extensions/interfaces/common';
import { IService } from './service/interfaces/common';

export class BitPlayr {
  static async videoProvider(service: IService): Promise<VProvider> {
    const url = await service.getUrl();
    return { manifestUrl: url };
  }

  static async createPlayer(videoElementId: string, config: IGlobalConfig): Promise<Player> {
    SdkConfig.setConfig(config.sdkConfig);
    PlayerConfig.setConfig(config.playerConfig);

    const strategy = await config.deviceCapabilities.determineStrategy();
    const player = new Player(strategy, videoElementId);

    config.extensions.forEach((extension) => {
      extension.apply(player);
    });

    return player;
  }
}
