import { IDeviceCapabilities } from '../../capabilities/interfaces/ICommon';
import { ISdkConfig } from '../configs/interfaces/IConfigs';
import { IPlayerExtension } from '../../extensions/interfaces/ICommon';

export interface IVideoService {
  manifestUrl: string;
  trackingUrl?: string;
}

export enum EPlayerTypes {
  HLSJS = 'hls.js',
  VIDEOJS = 'video.js',
  DASHJS = 'dash.js',
}

export interface IPlayers {
  player: EPlayerTypes;
}

export interface IGlobalConfig {
  extensions: IPlayerExtension[];
  deviceCapabilities: IDeviceCapabilities;
  sdkConfig: ISdkConfig;
}
