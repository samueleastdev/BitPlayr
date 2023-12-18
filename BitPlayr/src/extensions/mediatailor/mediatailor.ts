import { BasePlayer } from '../../player/base/base-player';
import { TimeUpdateEvent } from '../../player/common/common';
import { MediaTailorConfig } from '../../service/mediatailor/config/mediatailor';
import { getUrl } from '../../utils/fetch';
import { IPlayerExtension } from '../interfaces/common';
import { Ad, AdBreak } from './interfaces/mediatailor';

export class MediatailorExtension implements IPlayerExtension {
  private player: BasePlayer | null;
  private adBreak: AdBreak[];

  constructor() {
    this.player = null;
    this.adBreak = [];
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleTimeupdate = this.handleTimeupdate.bind(this);
  }

  apply(player: BasePlayer) {
    this.player = player;
    player.on('loadedmetadata', this.handleLoadedMetadata);
    player.on('timeupdate', this.handleTimeupdate);
  }

  async handleLoadedMetadata() {
    if (MediaTailorConfig.getConfig() && MediaTailorConfig.getConfig().trackingUrl) {
      const results = await getUrl(MediaTailorConfig.getConfig().trackingUrl);
      if (this.player) {
        this.adBreak = results.avails;
        this.player.emit('adBreakData', results.avails);
      }
    }
  }

  async pingTrackingEvents(trackingUrls: string[]) {
    for (const url of trackingUrls) {
      if (url) {
        try {
          this.player?.emit('adTrackingPinged', url);
          await getUrl(url);
        } catch (error) {
          console.error(`Error pinging tracking URL: ${url}`, error);
        }
      } else {
        //console.log('empty url');
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

    if (adData) {
      const currentTimeInAd = event.currentTime - adStartTime;

      // Filter tracking URLs based on the current time within the ad.
      /*if (adData.trackingEvents) {
        const trackingUrlsToPing = adData.trackingEvents
          .filter((trackingEvent: TrackingEvent) => {
            const eventTime = trackingEvent.offsetInSeconds || 0;
            return currentTimeInAd >= eventTime;
          })
          .map((trackingEvent) => trackingEvent.url);

        // Ping the tracking event URLs.
        this.pingTrackingEvents(trackingUrlsToPing);
      }*/
      // Emit event data as before.
      this.player?.emit('adIsPlaying', {
        isPlaying: isAdPlaying,
        remainingTime: adDuration - currentTimeInAd,
        progress: currentTimeInAd / adDuration,
        ad: adData,
      });
    } else {
      this.player?.emit('adIsPlaying', {
        isPlaying: false,
      });
    }
  }
}
