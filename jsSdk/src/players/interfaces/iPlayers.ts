import { IPlayerPlugin } from '../../plugins/interfaces/common';

export interface IPlayerStrategy {
  initialize(videoElementId: string, streamUrl: string): void;
  onTimeUpdate(callback: (time: number) => void): void;
  onSeeked(callback: (time: number) => void): void;
  fullscreen(): void;
  play(): void;
  pause(): void;
}

export interface PlayerConfig {
  player: string;
  plugins: IPlayerPlugin[];
  deviceCapabilities: {
    supportsAdvancedFeatures: boolean;
  };
}
