import { IConfig } from '../../../configs/interfaces/IConfigs';
import { EPlayerTypes } from '../../../core/interfaces/ICommon';

export interface IBasicOptions {
  default: EPlayerTypes;
  config: IConfig;
}
