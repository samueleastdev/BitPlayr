import { IPlayerStrategy } from '../../players/interfaces/iPlayers';
import { EPlayerTypes } from '../../extensions/interfaces/common';
import { supportsDashPlayback } from '../../utils/dash';
import { supportsHlsPlayback } from '../../utils/hls';
import { IDeviceCapabilities } from '../interfaces/common';
import { IBasicOptions } from './interfaces/iBasic';
import { IPlayerConfig } from '../../core/configs/interfaces/iConfigs';

export class BasicCapabilites implements IDeviceCapabilities {
  private playerConfig: IPlayerConfig;
  private player = EPlayerTypes.HLSJS;
  constructor(private options: IBasicOptions) {
    this.player = options.default;
    this.playerConfig = options.playerConfig;
  }

  async determineStrategy(): Promise<IPlayerStrategy> {
    if (supportsHlsPlayback()) {
      const { HlsJsStrategy } = await import('../../players/hlsjs');
      return new HlsJsStrategy(this.playerConfig.hls);
    }

    if (supportsDashPlayback()) {
      const { DashJsStrategy } = await import('../../players/dashjs');
      return new DashJsStrategy(this.playerConfig.dash);
    }

    const { VideoJsStrategy } = await import('../../players/videojs');
    return new VideoJsStrategy(this.playerConfig.videojs);
  }
}
