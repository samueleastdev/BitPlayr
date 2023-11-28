import { Player } from '../../core/basePlayer';
import { TimeUpdateEvent } from '../../players/interfaces/iPlayers';
import { MediaTailorConfig } from '../../service/mediatailor/config/cMediatailor';
import { getUrl } from '../../utils/fetch';
import { IPlayerExtension } from '../interfaces/common';
import ProgressBar from 'progressbar.js';

export class MediatailorExtension implements IPlayerExtension {
  private adsData: any[];
  private adOverlayDiv: HTMLElement | null;
  private progressBar: any;
  private player: Player | null;
  private videoElement: HTMLElement | null;

  constructor() {
    this.adsData = [];
    this.adOverlayDiv = null;
    this.videoElement = null;
    this.progressBar = null;
    this.player = null;
  }

  apply(player: Player) {
    this.player = player;

    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleManifestAvailable = this.handleManifestAvailable.bind(this);
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleTimeupdate = this.handleTimeupdate.bind(this);

    player.on('initialize', this.handleInitialize);
    player.on('manifestAvailable', this.handleManifestAvailable);
    player.on('loadedmetadata', this.handleLoadedMetadata);
    player.on('timeupdate', this.handleTimeupdate);

    this.createProgressBar();
  }

  createProgressBar() {
    if (!this.player) return;
    this.adOverlayDiv = document.createElement('div');
    this.adOverlayDiv.style.position = 'absolute';
    this.adOverlayDiv.style.bottom = '40px';
    this.adOverlayDiv.style.left = '40px';
    this.adOverlayDiv.style.width = '80px';
    this.adOverlayDiv.style.height = '80px';
    this.adOverlayDiv.style.display = 'none';
    this.adOverlayDiv.id = 'ad-overlay';

    this.progressBar = new ProgressBar.Circle(this.adOverlayDiv, {
      strokeWidth: 8,
      color: '#FFEA82',
      trailColor: '#000',
      trailWidth: 8,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: null,
      fill: 'rgba(0, 0, 0)',
      text: {
        autoStyleContainer: false,
        value: 'Ad',
      },
      from: { color: 'rgb(255, 234, 130)' },
      to: { color: 'rgb(255, 234, 130)' },
      step: (state, circle) => {
        if (circle && circle.path) {
          circle.path.setAttribute('stroke', state.color);
        }
      },
    });

    this.videoElement = document.getElementById(this.player.getVideoElementId());
    if (this.videoElement && this.videoElement.parentNode) {
      this.videoElement.parentNode.insertBefore(this.adOverlayDiv, this.videoElement.nextSibling);
    }
  }

  handleInitialize(player: any) {}

  handleManifestAvailable(data: any) {}

  async handleLoadedMetadata(data: any) {
    if (MediaTailorConfig.getConfig().trackingUrl) {
      const results = await getUrl(MediaTailorConfig.getConfig().trackingUrl);
      this.adsData = results.avails;
    }
  }

  handleTimeupdate(event: TimeUpdateEvent) {
    let isAdPlaying = false;
    let adDuration = 0;
    let adStartTime = 0;

    if (this.adsData && this.adsData.length > 0) {
      for (const adBreak of this.adsData) {
        for (const ad of adBreak.ads) {
          adStartTime = ad.startTimeInSeconds;
          adDuration = ad.durationInSeconds;
          const adEnd = adStartTime + adDuration;

          if (event.currentTime >= adStartTime && event.currentTime <= adEnd) {
            isAdPlaying = true;
            break;
          }
        }
        if (isAdPlaying) break;
      }
    }

    if (isAdPlaying && this.adOverlayDiv) {
      if (this.videoElement && this.videoElement.parentNode) {
        const controlBar = this.videoElement.parentNode.querySelector('#control-bar');
        if (controlBar instanceof HTMLElement) {
          controlBar.style.display = 'none';
        }
      }

      const currentTimeInAd = event.currentTime - adStartTime;
      const remainingTime = adDuration - currentTimeInAd;
      const progress = currentTimeInAd / adDuration;

      if (this.progressBar) {
        this.progressBar.animate(progress * 2);
        this.progressBar.setText(`${Math.ceil(remainingTime)}s`);
      }
      this.adOverlayDiv.style.display = 'block';
    } else if (this.adOverlayDiv) {
      if (this.videoElement && this.videoElement.parentNode) {
        const controlBar = this.videoElement.parentNode.querySelector('#control-bar');
        if (controlBar instanceof HTMLElement) {
          controlBar.style.display = 'flex';
        }
      }
      this.adOverlayDiv.style.display = 'none';
    }
  }
}
