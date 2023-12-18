import UAParser from 'ua-parser-js';
import { LogLevel, SDKLogger } from '../logger/logger';

export enum EDeviceType {
  Browser = 'Browser',
  Tizen = 'Tizen',
}

export class DeviceType {
  private parser;
  private logger: SDKLogger;

  constructor() {
    this.parser = new UAParser();
    this.logger = new SDKLogger(LogLevel.INFO);
  }

  device(): EDeviceType {
    const result = this.parser.getResult();
    if (this.isTizenOS(result.ua)) {
      this.logger.info(`DeviceType : ${EDeviceType.Tizen}`);
      return EDeviceType.Tizen;
    }

    return EDeviceType.Browser;
  }

  private isTizenOS(userAgentString: string) {
    return userAgentString.indexOf('Tizen') !== -1;
  }
}
