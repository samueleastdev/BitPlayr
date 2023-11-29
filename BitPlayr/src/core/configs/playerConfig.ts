import { IPlayerConfig } from './interfaces/IConfigs';

export class PlayerConfig {
  private static config: IPlayerConfig;

  static setConfig(newConfig: IPlayerConfig) {
    PlayerConfig.config = newConfig;
  }

  static getConfig(): IPlayerConfig {
    return PlayerConfig.config;
  }

  static updateConfig(partialConfig: Partial<IPlayerConfig>) {
    PlayerConfig.config = { ...PlayerConfig.config, ...partialConfig };
  }
}
