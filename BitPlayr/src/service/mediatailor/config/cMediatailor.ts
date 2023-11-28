import { MediatailorConfig } from '../interfaces/iMediatailor';

export class MediaTailorConfig {
  private static config: MediatailorConfig;

  static setConfig(newConfig: MediatailorConfig) {
    MediaTailorConfig.config = newConfig;
  }

  static getConfig(): MediatailorConfig {
    return MediaTailorConfig.config;
  }
}
