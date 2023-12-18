export interface ITracks {
  subtitles?: ITrack[];
  audio?: ITrack[];
}

export interface ITrack {
  id?: number | null;
  index?: number | null;
  type: string | null;
  lang: string | null;
  roles?: string[] | null;
  labels?: { text: string; lang?: string | undefined }[] | null;
  codec?: string | null;
  mimeType?: string | null;
  groupId?: string | null;
  name?: string | null;
  default?: boolean | null;
  autoselect?: boolean | null;
  forced?: boolean | null;
}

export interface DashJsTrackChangeEvent extends Event {
  newMediaInfo: {
    index: number;
    type: string;
    lang: string;
    roles: string[];
    labels: any[];
    codec: string;
    mimeType: string;
  };
}

export declare interface IQualityLevel {
  index?: number;
  audioCodec?: string;
  bitrate: number;
  height?: number;
  id?: number;
  level?: number;
  name?: string;
  textCodec?: string;
  unknownCodecs?: string[];
  url?: string;
  videoCodec?: string;
  width?: number;
}
