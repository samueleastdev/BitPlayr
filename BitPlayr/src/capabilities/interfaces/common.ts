import { IPlayerStrategy } from '../../players/interfaces/iPlayers';

export interface IDeviceCapabilities {
  determineStrategy(): Promise<IPlayerStrategy>;
}
