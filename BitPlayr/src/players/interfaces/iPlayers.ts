import { IPlayerExtension, VProvider } from '../../extensions/interfaces/common';

export interface TimeUpdateEvent {
  currentTime: number;
  duration: number;
}

export interface IPlayerStrategy {
  init(videoElementId: string, provider: VProvider): void;
  onTimeUpdate(callback: (event: TimeUpdateEvent) => void): void;
  onSeeked(callback: (time: number) => void): void;
  onManifestAvailable(callback: (data: any) => void): void;
  onLoadedMetadata(callback: (event: Event) => void): void;
  seekTo(time: number): void;
  fullscreen(): void;
  play(): void;
  pause(): void;
}

export interface PlayerConfig {
  player: string;
  plugins: IPlayerExtension[];
  deviceCapabilities: {
    supportsAdvancedFeatures: boolean;
  };
}
