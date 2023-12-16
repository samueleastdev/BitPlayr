export enum EPlayerTypes {
  HLSJS = 'hls.js',
  VIDEOJS = 'video.js',
  DASHJS = 'dash.js',
}

export interface IPlayers {
  player: EPlayerTypes;
}

export interface TimeUpdateEvent {
  currentTime: number;
  duration: number;
  timeDisplay?: string;
}

/*
export interface IPlayer {
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
}*/
