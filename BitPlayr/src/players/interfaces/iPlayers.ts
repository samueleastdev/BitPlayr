import { IVideoService } from '../../core/interfaces/ICommon';
import { IPlayerExtension } from '../../extensions/interfaces/ICommon';
import { IQualityLevel } from './IBitrates';
import { ITrack, ITracks } from './ITracks';

export interface TimeUpdateEvent {
  currentTime: number;
  duration: number;
  timeDisplay?: string;
}

export interface IPlayerStrategy {
  createPlayer(videoElementId: string): void;
  load(provider: IVideoService): void;
  onTimeUpdate(callback: (event: TimeUpdateEvent) => void): void;
  onSeeked(callback: (time: number) => void): void;
  onManifestAvailable(callback: (data: any) => void): void;
  onQualityLevels(callback: (data: IQualityLevel[]) => void): void;
  onQualityChange(callback: (data: IQualityLevel) => void): void;
  setQuality(level: IQualityLevel): void;
  onTracks(callback: (tracks: ITracks) => void): void;
  onTrackChanged(callback: (track: ITrack) => void): void;
  setTrack(track: ITrack): void;
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
