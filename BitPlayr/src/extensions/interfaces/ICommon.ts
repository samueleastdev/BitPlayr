import { BasePlayer } from '../../player/base/BasePlayer';

export interface IPlayerExtension {
  apply(player: BasePlayer): void;
}
