import { IPlayerStrategy } from '../../players/interfaces/IPlayers';
import { supportsDashPlayback } from '../../utils/dash';
import { supportsHlsPlayback } from '../../utils/hls';
import { IDeviceCapabilities } from '../interfaces/ICommon';
import { IBasicOptions } from './interfaces/IBasic';
import { IConfig } from '../../configs/interfaces/IConfigs';
import { EPlayerTypes } from '../../core/interfaces/ICommon';
import { ShakaStrategy } from '../../players/shaka/shaka';
import { DashJsStrategy } from '../../players/dashjs/dashjs';
import { HlsJsStrategy } from '../../players/hlsjs/hlsjs';
import UAParser from 'ua-parser-js';
import { LogLevel, SDKLogger } from '../../logger/logger';

export class BasicCapabilities implements IDeviceCapabilities {
  private config: IConfig;
  private player = EPlayerTypes.HLSJS;
  private parser;
  private logger: SDKLogger;

  constructor(private options: IBasicOptions) {
    this.player = options.default;
    this.config = options.config;
    this.parser = new UAParser();
    this.logger = new SDKLogger(LogLevel.INFO);
  }

  async determineStrategy(): Promise<IPlayerStrategy> {
    const result = this.parser.getResult();

    this.logger.info(`UAParser: `, result);

    if (result.browser.name === 'Chrome') {
      this.config.global.autoplay = true;
      this.config.shaka.streaming.rebufferingGoal = 4;
    }
    //const { ShakaStrategy } = await import('../../players/shaka/shaka');
    return new ShakaStrategy(this.config);

    if (supportsDashPlayback()) {
      //const { DashJsStrategy } = await import('../../players/dashjs/dashjs');
      return new DashJsStrategy(this.config);
    }
    if (supportsHlsPlayback()) {
      //const { HlsJsStrategy } = await import('../../players/hlsjs/hlsjs');
      return new HlsJsStrategy(this.config);
    }
  }
}
