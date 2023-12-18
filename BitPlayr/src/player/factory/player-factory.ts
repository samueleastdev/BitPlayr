import { IPlayerConfig } from '../../configs/interfaces/configs';
import { EDeviceType } from '../../device/device-type';
import { IDeviceDetails } from '../../device/common/common';
import { DashPlayer } from '../dash/dash-player';
import { HlsPlayer } from '../hls/hls-player';

export class PlayerFactory {
  static createPlayer(
    videoElement: HTMLMediaElement,
    playerConfig: IPlayerConfig,
    deviceInfo: IDeviceDetails,
  ): HlsPlayer | DashPlayer {
    if (deviceInfo.deviceType === EDeviceType.Tizen) {
      return new HlsPlayer(videoElement, playerConfig, deviceInfo);
    }

    if (deviceInfo.deviceType === EDeviceType.Browser) {
      return new HlsPlayer(videoElement, playerConfig, deviceInfo);
    }

    throw new Error('Unsupported device type for player creation');
  }
}
