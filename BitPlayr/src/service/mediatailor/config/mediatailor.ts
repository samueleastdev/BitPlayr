import { IMediatailorConfig } from '../interfaces/IMediatailor';

export class MediaTailorConfig {
  private static config: IMediatailorConfig;

  static setConfig(newConfig: IMediatailorConfig) {
    MediaTailorConfig.config = newConfig;
  }

  static getConfig(): IMediatailorConfig {
    return MediaTailorConfig.config;
  }
}
