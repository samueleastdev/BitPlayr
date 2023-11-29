import { IPlayerStrategy } from '../../players/interfaces/IPlayers';

export interface IDeviceCapabilities {
  determineStrategy(): Promise<IPlayerStrategy>;
}
