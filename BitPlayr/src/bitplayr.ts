import { Player } from './core/basePlayer';
import { SdkConfig } from './configs/sdkConfig';
import { IGlobalConfig, IVideoService } from './core/interfaces/ICommon';
import { IService } from './service/interfaces/ICommon';

export class BitPlayr {
  static async videoProvider(service: IService): Promise<IVideoService> {
    const url = await service.getUrl();
    return { manifestUrl: url };
  }

  static async createPlayer(videoElementId: string, config: IGlobalConfig): Promise<Player> {
    SdkConfig.setConfig(config.sdkConfig);

    const strategy = await config.deviceCapabilities.determineStrategy();
    const player = new Player(strategy, videoElementId);

    config.extensions.forEach((extension) => {
      extension.apply(player);
    });

    return player;
  }
}
