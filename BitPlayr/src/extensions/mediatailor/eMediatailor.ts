import { Player } from '../../core/basePlayer';
import { TimeUpdateEvent } from '../../players/interfaces/iPlayers';
import { MediaTailorConfig } from '../../service/mediatailor/config/cMediatailor';
import { getUrl } from '../../utils/fetch';
import { IPlayerExtension } from '../interfaces/common';

export class MediatailorExtension implements IPlayerExtension {
  private adsData: any[];
  private adOverlayDiv: HTMLElement | null;

  constructor() {
    this.adsData = [];
    this.adOverlayDiv = null;
  }

  apply(player: Player) {
    // Bind 'this' context to the event handler methods
    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleManifestAvailable = this.handleManifestAvailable.bind(this);
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
    this.handleTimeupdate = this.handleTimeupdate.bind(this);

    player.on('initialize', this.handleInitialize);
    player.on('manifestAvailable', this.handleManifestAvailable);
    player.on('loadedmetadata', this.handleLoadedMetadata);
    player.on('timeupdate', this.handleTimeupdate);

    const videoElementId = player.getVideoElementId();
    const videoElement = document.getElementById(videoElementId);

    // Create the overlay div
    this.adOverlayDiv = document.createElement('div');
    this.adOverlayDiv.style.position = 'absolute';
    this.adOverlayDiv.style.bottom = '20px';
    this.adOverlayDiv.style.left = '60px';
    this.adOverlayDiv.style.transform = 'translate(-50%, -50%)';
    this.adOverlayDiv.style.width = '80px'; // Circular shape
    this.adOverlayDiv.style.height = '80px'; // Circular shape
    this.adOverlayDiv.style.borderRadius = '50%'; // Circular shape
    this.adOverlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.adOverlayDiv.style.display = 'flex';
    this.adOverlayDiv.style.justifyContent = 'center';
    this.adOverlayDiv.style.alignItems = 'center';
    this.adOverlayDiv.style.color = 'white';
    this.adOverlayDiv.style.fontSize = '12px';
    this.adOverlayDiv.style.display = 'none'; // Initially hidden

    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.width = '80px';
    progressBarContainer.style.height = '80px';
    progressBarContainer.style.position = 'absolute';
    progressBarContainer.style.top = '0';
    progressBarContainer.style.left = '0';
    progressBarContainer.style.borderRadius = '50%';
    progressBarContainer.style.transform = 'rotate(-90deg)'; // Initial rotation
    this.adOverlayDiv.appendChild(progressBarContainer);

    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '100%';
    progressBar.style.borderRadius = '50%';
    progressBar.style.border = '5px solid green';
    progressBar.style.borderRightColor = 'transparent';
    progressBar.style.boxSizing = 'border-box';
    progressBarContainer.appendChild(progressBar);

    const adTextDiv = document.createElement('div');
    adTextDiv.style.position = 'absolute';
    adTextDiv.style.top = '50%';
    adTextDiv.style.left = '50%';
    adTextDiv.style.transform = 'translate(-50%, -50%)';
    adTextDiv.style.color = 'white';
    adTextDiv.style.fontSize = '12px';
    adTextDiv.innerText = 'Advertisement'; // Default text
    this.adOverlayDiv.appendChild(adTextDiv);

    videoElement?.parentNode?.insertBefore(this.adOverlayDiv, videoElement.nextSibling);
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
      const progressBarContainer = this.adOverlayDiv.firstChild as HTMLElement;
      const adTextDiv = this.adOverlayDiv.lastChild as HTMLElement;
      const currentTimeInAd = event.currentTime - adStartTime;
      const remainingTime = adDuration - currentTimeInAd;
      const percentage = (currentTimeInAd / adDuration) * 100;
      const angle = percentage * 3.6; // Convert percentage to degrees

      if (progressBarContainer) {
        progressBarContainer.style.transform = `rotate(${angle - 90}deg)`;
      }

      if (adTextDiv) {
        adTextDiv.innerText = `Ad in ${remainingTime.toFixed(0)}s`;
      }

      this.adOverlayDiv.style.display = 'block'; // Show overlay
    } else if (this.adOverlayDiv) {
      this.adOverlayDiv.style.display = 'none'; // Hide overlay
    }
  }
}
