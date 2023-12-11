import { SdkConfig } from '../configs/sdkConfig';
import { SDKLogger } from '../logger/logger';
import { IQualityLevel } from '../players/interfaces/IBitrates';
import { IPlayerStrategy, TimeUpdateEvent } from '../players/interfaces/IPlayers';
import { ITrack } from '../players/interfaces/ITracks';
import { IVideoService } from './interfaces/ICommon';

export abstract class BasePlayerStrategy implements IPlayerStrategy {
  protected videoElement!: HTMLMediaElement;
  protected videoElementId!: string;
  protected logger: SDKLogger;

  constructor() {
    this.logger = new SDKLogger(SdkConfig.getConfig().logLevel);
  }

  abstract createPlayer(videoElementId: string): void;

  abstract load(provider: IVideoService): void;

  setQuality(level: IQualityLevel): void {
    throw new Error('Method not implemented.');
  }

  setTrack(track: ITrack): void {
    throw new Error('Method not implemented.');
  }

  onTracks(callback: (data: any) => void): void {
    throw new Error('Method not implemented.');
  }

  onTrackChanged(callback: (data: any) => void): void {
    throw new Error('Method not implemented.');
  }

  onManifestAvailable(callback: (event: any) => void): void {
    // callback will be used in subclass implementations
    callback(true);
  }

  onQualityLevels(callback: (event: any) => void): void {
    // callback will be used in subclass implementations
    callback(true);
  }

  onQualityChange(callback: (event: any) => void): void {
    // callback will be used in subclass implementations
    callback(true);
  }

  onTimeUpdate(callback: (event: TimeUpdateEvent) => void): void {
    this.videoElement.addEventListener('timeupdate', () => {
      callback({
        currentTime: this.videoElement.currentTime,
        duration: this.videoElement.duration,
      });
    });
  }

  onSeeked(callback: (time: number) => void): void {
    this.videoElement.addEventListener('seeked', () => {
      callback(this.videoElement.currentTime);
    });
  }

  onLoadedMetadata(callback: (event: Event) => void): void {
    this.videoElement.addEventListener('loadedmetadata', (event) => {
      this.logger.info(`loadedmetadata called:`, event);
      callback(event);
    });
  }

  fullscreen(): void {
    if (this.videoElement) {
      this.videoElement.requestFullscreen();
    }
  }

  async play(): Promise<void> {
    try {
      await this.videoElement.play();
      return Promise.resolve();
    } catch (err) {
      return Promise.reject();
    }
  }

  pause(): void {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  seekTo(time: number): void {
    if (this.videoElement) {
      if (typeof this.videoElement.fastSeek === 'function') {
        this.videoElement.fastSeek(time);
      } else {
        this.videoElement.currentTime = isNaN(time) ? 0 : time;
      }
    }
  }
}
