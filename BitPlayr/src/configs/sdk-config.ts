import { ISdkConfig } from './interfaces/configs';

export class SdkConfig {
  private static config: ISdkConfig;

  static setConfig(newConfig: ISdkConfig) {
    SdkConfig.config = newConfig;
  }

  static getConfig(): ISdkConfig {
    return SdkConfig.config;
  }

  static updateConfig(partialConfig: Partial<ISdkConfig>) {
    SdkConfig.config = { ...SdkConfig.config, ...partialConfig };
  }
}
