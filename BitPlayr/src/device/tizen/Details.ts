import { IDeviceDetailsProvider, IDeviceDetailsSpec } from '../common/ICommon';
import { TizenWindow } from './interfaces/ICommon';

export class TizenDetails implements IDeviceDetailsProvider {
  constructor(private context: TizenWindow) {
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
