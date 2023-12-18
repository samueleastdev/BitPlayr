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

export enum VideoEvents {
  Abort = 'abort',
  CanPlay = 'canplay',
  CanPlayThrough = 'canplaythrough',
  DurationChange = 'durationchange',
  Emptied = 'emptied',
  Ended = 'ended',
  Error = 'error',
  LoadedData = 'loadeddata',
  LoadedMetadata = 'loadedmetadata',
  LoadStart = 'loadstart',
  Pause = 'pause',
  Play = 'play',
  Playing = 'playing',
  Progress = 'progress',
  RateChange = 'ratechange',
  Seeked = 'seeked',
  Seeking = 'seeking',
  Stalled = 'stalled',
  Suspend = 'suspend',
  TimeUpdate = 'timeupdate',
  VolumeChange = 'volumechange',
  Waiting = 'waiting',
}
