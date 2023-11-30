import { LogLevel } from '../../logger/logger';

export interface ISdkConfig {
  logLevel?: LogLevel;
  telemetryEnabled?: boolean;
}

export interface IPlayerConfig {
  videojs: any;
  hls: any;
  dash: any;
}
