import { Player } from '../../core/basePlayer';
import { IPlayerConfig, ISdkConfig } from '../../core/configs/interfaces/iConfigs';

export interface VProvider {
  manifestUrl: string;
  trackingUrl?: string;
}
export interface IPlayerExtension {
  apply(player: Player): void;
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
  deviceCapabilities: any;
  sdkConfig: ISdkConfig;
}
