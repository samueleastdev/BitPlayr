import { IDeviceDetailsProvider, IDeviceDetailsSpec } from '../common/common';
import { TizenWindow } from './interfaces/common';

export class TizenDetails implements IDeviceDetailsProvider {
  constructor(private context: TizenWindow) {
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
