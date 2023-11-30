import { IPlayerConfig } from '../../../configs/interfaces/IConfigs';
import { EPlayerTypes } from '../../../core/interfaces/ICommon';

export interface IBasicOptions {
  default: EPlayerTypes;
  playerConfig: IPlayerConfig;
}
