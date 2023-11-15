import { SdkConfig } from '../plugins/interfaces/common';

export class SdkConfigService {
  private static config: SdkConfig;

  static setConfig(newConfig: SdkConfig) {
    SdkConfigService.config = newConfig;
  }

  static getConfig(): SdkConfig {
    return SdkConfigService.config;
  }
}
