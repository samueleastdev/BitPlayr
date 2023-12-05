interface IDashAudioTracks {
  index: number;
  type: string;
  labels: string[];
  lang: string;
  roles: string[];
  codec: string;
  mimeType: string;
}

interface IHlsAudioTracks {
  attrs: {
    TYPE: string;
    'GROUP-ID': string;
    NAME: string;
    DEFAULT: string;
    AUTOSELECT: string;
    FORCED: string;
    LANGUAGE: string;
    CHARACTERISTICS: string;
    URI: string;
  };
  bitrate: number;
  id: number;
  groupId: string;
  name: string;
  type: string;
  default: boolean;
  autoselect: boolean;
  forced: boolean;
  lang: string;
  url: string;
}

export type IAudioTrack = Partial<IDashAudioTracks & IHlsAudioTracks>;
