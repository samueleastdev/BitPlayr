import { Player } from '../../core/basePlayer';
import { TimeUpdateEvent } from '../../players/interfaces/iPlayers';
import { MediaTailorConfig } from '../../service/mediatailor/config/cMediatailor';
import { getUrl } from '../../utils/fetch';
import { IPlayerExtension } from '../interfaces/common';
import { Ad, AdBreak } from './interfaces/iMediatailor';

export class MediatailorExtension implements IPlayerExtension {
  private player: Player | null;
  private adBreak: AdBreak[];

  constructor() {
    this.player = null;
    this.adBreak = [];
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleTimeupdate = this.handleTimeupdate.bind(this);
  }

  apply(player: Player) {
    this.player = player;
    player.on('loadedmetadata', this.handleLoadedMetadata);
    player.on('timeupdate', this.handleTimeupdate);
  }

  async handleLoadedMetadata() {
    if (MediaTailorConfig.getConfig().trackingUrl) {
      const results = await getUrl(MediaTailorConfig.getConfig().trackingUrl);
      if (this.player) {
        this.adBreak = results.avails;
        this.player.emit('adBreakData', results.avails);
      }
    }
  }

  handleTimeupdate(event: TimeUpdateEvent) {
    let isAdPlaying = false;
    let adDuration = 0;
    let adStartTime = 0;
    let adData: Ad | null = null;

    if (this.adBreak && this.adBreak.length > 0) {
      for (const adBreak of this.adBreak) {
        for (const ad of adBreak.ads) {
          adStartTime = ad.startTimeInSeconds;
          adDuration = ad.durationInSeconds;
          const adEnd = adStartTime + adDuration;

          if (event.currentTime >= adStartTime && event.currentTime <= adEnd) {
            isAdPlaying = true;
            adData = ad;
            break;
          }
        }
        if (isAdPlaying) break;
      }
    }
    if (this.player) {
      const currentTimeInAd = event.currentTime - adStartTime;
      this.player.emit('adIsPlaying', {
        isPlaying: isAdPlaying,
        remainingTime: adDuration - currentTimeInAd,
        progress: currentTimeInAd / adDuration,
        ad: adData,
      });
    }
  }
}
