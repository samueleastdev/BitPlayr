import { IDeviceDetailsProvider, IDeviceDetailsSpec } from '../common/ICommon';

export class BrowserDetails implements IDeviceDetailsProvider {
  constructor(private context: Window) {
    this.context = context;
  }

  getDeviceDetails(): Promise<IDeviceDetailsSpec> {
    const details: IDeviceDetailsSpec = {
      manufacturer: 'Laptop Manufacturer',
      model: 'Laptop Model',
    };

    return Promise.resolve(details);
  }
}
