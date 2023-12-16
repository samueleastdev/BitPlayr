import { SdkConfig } from './configs/sdkConfig';
import { IService, IVideoService } from './service/interfaces/ICommon';
import { DeviceFactory } from './device/factory/DeviceFactory';
import { IDeviceDetails } from './device/common/ICommon';
import { DeviceType } from './device/DeviceType';
import { PlayerFactory } from './player/factory/PlayerFactory';
import { BasePlayer } from './player/base/BasePlayer';
import { IPlayerExtension } from './extensions/interfaces/ICommon';
import { IGlobalConfig } from './configs/interfaces/IConfigs';

export class BitPlayr {
  static async initialiseDevice(): Promise<IDeviceDetails | undefined> {
    const context = window;

    try {
      const deviceType = new DeviceType();

      const device = DeviceFactory.createDevice(deviceType.device(), context);

      const details = await device.getDeviceDetails();

      const inputs = await device.setupInputs();

      const ua = await device.getInfo();

      const result: IDeviceDetails = {
        type: 'HLS',
        inputs,
        details,
        ua,
      };
      console.log('details', result);

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
