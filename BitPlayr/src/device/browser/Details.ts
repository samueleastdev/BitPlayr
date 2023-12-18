import { IDeviceDetailsProvider, IDeviceDetailsSpec } from '../common/common';

export class BrowserDetails implements IDeviceDetailsProvider {
  constructor(private context: Window) {
    this.context = context;
  }

  getDeviceApi(): Promise<IDeviceDetailsSpec> {
    const details: IDeviceDetailsSpec = {
      manufacturer: 'Laptop Manufacturer',
      model: 'Laptop Model',
    };

    return Promise.resolve(details);
  }
}
