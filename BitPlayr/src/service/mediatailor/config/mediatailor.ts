import { IMediatailorConfig } from '../interfaces/mediatailor';

export class MediaTailorConfig {
  private static config: IMediatailorConfig;

  static setConfig(newConfig: IMediatailorConfig) {
    MediaTailorConfig.config = newConfig;
  }

  static getConfig(): IMediatailorConfig {
    return MediaTailorConfig.config;
  }
}
