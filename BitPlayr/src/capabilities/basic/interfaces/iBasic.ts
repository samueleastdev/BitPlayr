import { IPlayerConfig } from '../../../core/configs/interfaces/iConfigs';
import { EPlayerTypes } from '../../../extensions/interfaces/common';

export interface IBasicOptions {
  default: EPlayerTypes;
  playerConfig: IPlayerConfig;
}
