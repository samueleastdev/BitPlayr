import { LogLevel } from '../../logger/logger';

export interface ISdkConfig {
  logLevel?: LogLevel;
  telemetryEnabled?: boolean;
}

export interface IGlobalConfig {
  autoplay?: boolean;
  startTime?: number;
  preferredLanguage?: string;
}

export interface IConfig {
  global: IGlobalConfig;
  hls?: any;
  dash?: any;
  shaka?: any;
}
