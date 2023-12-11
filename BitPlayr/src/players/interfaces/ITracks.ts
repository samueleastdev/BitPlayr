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
