import { EventEmitter } from 'events';
import { LogLevel, SDKLogger } from '../../logger/logger';
import { IDeviceDetails } from '../../device/common/common';
import { IPlayerConfig } from '../../configs/interfaces/configs';
import { IQualityLevel, ITrack } from '../interfaces/tracks';
import { IVideoService } from '../../service/interfaces/common';

export abstract class BasePlayer extends EventEmitter {
  protected logger: SDKLogger;

  constructor(
    public videoElement: HTMLMediaElement,
    protected playerConfig: IPlayerConfig,
    protected deviceInfo: IDeviceDetails,
  ) {
    super();
    this.logger = new SDKLogger(LogLevel.INFO);
    this.setupBaseEventListeners();
  }

  protected abstract initialize(): void;

  protected abstract collectStats(): void;

  public abstract load(provider: IVideoService): void;

  getDeviceInfo(): IDeviceDetails {
    return this.deviceInfo;
  }

  private setupBaseEventListeners(): void {
    this.videoElement.addEventListener('loadedmetadata', () => {
      this.onLoadedMetadata();
    });
  }

  private onLoadedMetadata(): void {
    const stats = this.collectStats();
    this.emit('playerStats', stats);
  }

  getVideoElementId(): HTMLMediaElement {
    return this.videoElement;
  }

  async play(): Promise<void> {
    return this.videoElement.play();
  }

  pause(): void {
    this.videoElement.pause();
  }

  fullscreen(): void {
    this.emit('fullscreen');
    this.videoElement.requestFullscreen();
  }

  seekTo(time: number): void {
    this.emit('seekTo', time);
    if (typeof this.videoElement.fastSeek === 'function') {
      this.videoElement.fastSeek(time);
    } else {
      this.videoElement.currentTime = isNaN(time) ? 0 : time;
    }
  }

  setQuality(level: IQualityLevel) {
    this.setQuality(level);
  }

  setTrack(track: ITrack) {
    this.setTrack(track);
  }
}
