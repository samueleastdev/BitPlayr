import { IService } from '../interfaces/ICommon';

// BasicService implementation
export class BasicService implements IService {
  private url: string;

  constructor(options: { url: string }) {
    this.url = options.url;
  }

  async getUrl(): Promise<string> {
    // Perform URL manipulation or return the URL directly
    return this.url;
  }
}
