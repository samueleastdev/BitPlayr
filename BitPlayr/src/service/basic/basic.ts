import { IService } from '../interfaces/ICommon';
import { BasicConfig } from './config/basic';

// BasicService implementation
export class BasicService implements IService {
  private url: string;
  private bif: string;

  constructor(options: { url: string; bif: string }) {
    this.url = options.url;
    this.bif = options.bif;
  }

  async getUrl(): Promise<string> {
    const bifData = await this.getBifData();
    console.log('bifData', bifData);
    return this.url;
  }

  async getBifData() {
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
