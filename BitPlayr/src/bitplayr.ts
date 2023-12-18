import { SdkConfig } from './configs/sdk-config';
import { IService, IVideoService } from './service/interfaces/common';
import { DeviceFactory } from './device/factory/device-factory';
import { IDeviceDetails } from './device/common/common';
import { DeviceType } from './device/device-type';
import { PlayerFactory } from './player/factory/player-factory';
import { BasePlayer } from './player/base/base-player';
import { IPlayerExtension } from './extensions/interfaces/common';
import { IGlobalConfig } from './configs/interfaces/configs';

export class BitPlayr {
  static async initialiseDevice(): Promise<IDeviceDetails | undefined> {
    const context = window;

    try {
      const deviceType = new DeviceType();
      const device = DeviceFactory.createDevice(deviceType.device(), context);
      const details = await device.getDeviceApi();
      const inputs = await device.setupInputs();
      const ua = await device.getInfo();

      const result: IDeviceDetails = {
        deviceType: deviceType.device(),
        inputs,
        details,
        ua,
      };

      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  static async videoProvider(service: IService): Promise<IVideoService> {
    const url = await service.getUrl();
    return { manifestUrl: url };
  }

  static async createPlayer(
    videoElementId: string,
    config: IGlobalConfig,
    deviceInfo: IDeviceDetails,
  ): Promise<BasePlayer> {
    SdkConfig.setConfig(config.sdkConfig);

    const videoElement = document.getElementById(videoElementId) as HTMLMediaElement;

    const player = PlayerFactory.createPlayer(videoElement, config.playerConfig, deviceInfo);

    config.extensions.forEach((extension: IPlayerExtension) => {
      extension.apply(player);
    });
    return player;
  }
}
