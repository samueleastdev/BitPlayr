import { BasePlayer } from '../../player/base/base-player';
import { TimeUpdateEvent } from '../../player/common/common';
import { IPlayerExtension } from '../interfaces/common';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;

const gaMeasurementId = 'GTM-T7VFBVWQ';

export class GoogleAnalyticsExtension implements IPlayerExtension {
  constructor() {
    this.injectScript();
  }
  apply(player: BasePlayer) {
    player.on('timeupdate', this.handleTimeUpdate.bind(this));
    player.on('play', this.handlePlay.bind(this));
    player.on('pause', this.handlePause.bind(this));
  }

  handlePlay() {
    console.log('play called');
    gtag('event', 'play', {
      event_category: 'Video',
      event_label: 'Video Played',
    });
  }

  handlePause() {
    console.log('pause called');
    gtag('event', 'pause', {
      event_category: 'Video',
      event_label: 'Video Paused',
    });
  }

  handleTimeUpdate(event: TimeUpdateEvent) {
    // Optional: Track time updates, e.g., every 10 seconds
    //console.log('timeupdate called:', event);
    // You can implement a logic to send time update events at certain intervals
  }

  injectScript() {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    document.head.appendChild(gaScript);

    // Inline script for initializing Google Analytics
    const inlineScript = document.createElement('script');
    inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(inlineScript);
  }
}
