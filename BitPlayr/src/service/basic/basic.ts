import { IService } from '../interfaces/common';
import { BasicConfig } from './config/basic';

// BasicService implementation
export class BasicService implements IService {
  private url: string;
  private bif?: string;

  constructor(options: { url: string; bif?: string }) {
    this.url = options.url;
    this.bif = options.bif;
  }

  async getUrl(): Promise<string> {
    await this.getBifData();
    return this.url;
  }

  async getBifData() {
    if (!this.bif) {
      return;
    }
    try {
      const response = await fetch(this.bif, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.arrayBuffer();

      BasicConfig.setConfig({
        bifData: data,
      });

      return data;
    } catch (error) {
      throw new Error(`Fetching error: ${error}`);
    }
  }
}
