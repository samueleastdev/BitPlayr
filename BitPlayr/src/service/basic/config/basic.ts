import { IBasicConfig } from '../interfaces/IBasic';

export class BasicConfig {
  private static config: IBasicConfig;

  static setConfig(newConfig: IBasicConfig) {
    BasicConfig.config = newConfig;
  }

  static getConfig(): IBasicConfig {
    return BasicConfig.config;
  }
}
