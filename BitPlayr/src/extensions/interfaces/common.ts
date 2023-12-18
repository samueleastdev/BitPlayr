import { BasePlayer } from '../../player/base/base-player';

export interface IPlayerExtension {
  apply(player: BasePlayer): void;
}
