export interface IVideoService {
  manifestUrl: string;
  trackingUrl?: string;
}
export interface IService {
  getUrl(): Promise<string>;
}
