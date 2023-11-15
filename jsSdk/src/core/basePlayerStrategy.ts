import { IPlayerStrategy } from '../players/interfaces/iPlayers';

export abstract class BasePlayerStrategy implements IPlayerStrategy {
  protected videoElement!: HTMLMediaElement;

  abstract initialize(videoElementId: string, streamUrl: string): void;

  onTimeUpdate(callback: (time: number) => void) {
    this.videoElement.addEventListener('timeupdate', () => {
      callback(this.videoElement.currentTime);
    });
  }

  onSeeked(callback: (time: number) => void) {
    this.videoElement.addEventListener('seeked', () => {
      callback(this.videoElement.currentTime);
    });
  }

  fullscreen() {
    if (this.videoElement) {
      this.videoElement.requestFullscreen();
    }
  }

  play() {
    if (this.videoElement) {
      this.videoElement.play();
    }
  }

  pause() {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }
}
