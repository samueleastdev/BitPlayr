import { IService } from '../interfaces/common';
import { MediaTailorConfig } from './config/cMediatailor';

export class MediatailorService implements IService {
  private url: string;

  constructor(options: { url: string }) {
    this.url = options.url;
  }

  async getUrl(): Promise<string> {
    if (this.isMediatailor()) {
      const manifestUrl = await this.getMediaTailor();
      return manifestUrl;
    } else {
      return this.url;
    }
  }

  async getMediaTailor() {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      const mtUrl = new URL(this.url);

      MediaTailorConfig.setConfig({
        trackingUrl: `${mtUrl.origin}${json.trackingUrl}`,
      });

      return `${mtUrl.origin}${json.manifestUrl}`;
    } catch (error) {
      throw new Error(`Fetching error: ${error}`);
    }
  }

  isMediatailor() {
    return this.url.includes('.mediatailor.');
  }
}
