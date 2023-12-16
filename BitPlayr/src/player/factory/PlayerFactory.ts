import { IPlayerConfig } from '../../configs/interfaces/IConfigs';
import { IDeviceDetails } from '../../device/common/ICommon';
import { DashPlayer } from '../dash/DashPlayer';
import { HlsPlayer } from '../hls/HlsPlayer';

export class PlayerFactory {
  static createPlayer(
    videoElement: HTMLMediaElement,
    playerConfig: IPlayerConfig,
    deviceInfo: IDeviceDetails,
  ): HlsPlayer | DashPlayer {
    if (deviceInfo.type === 'HLS') {
      return new HlsPlayer(videoElement, playerConfig, deviceInfo);
    } else if (deviceInfo.type === 'Dash') {
      return new DashPlayer(videoElement, playerConfig, deviceInfo);
    } else {
      throw new Error('Unsupported device type for player creation');
    }
  }
}
