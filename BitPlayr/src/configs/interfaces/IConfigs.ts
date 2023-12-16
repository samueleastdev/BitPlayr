import { IPlayerExtension } from '../../extensions/interfaces/ICommon';
import { LogLevel } from '../../logger/logger';

export interface ISdkConfig {
  logLevel?: LogLevel;
  telemetryEnabled?: boolean;
}

export interface IGlobalPlayerConfig {
  autoplay?: boolean;
  startTime?: number;
  preferredLanguage?: string;
}

export interface IPlayerConfig {
  global: IGlobalPlayerConfig;
  hls?: any;
  dash?: any;
  shaka?: any;
}

export interface IGlobalConfig {
  extensions: IPlayerExtension[];
  playerConfig: IPlayerConfig;
  sdkConfig: ISdkConfig;
}
