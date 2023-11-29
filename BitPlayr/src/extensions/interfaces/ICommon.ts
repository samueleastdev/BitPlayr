import { Player } from '../../core/basePlayer';

export interface IPlayerExtension {
  apply(player: Player): void;
}
