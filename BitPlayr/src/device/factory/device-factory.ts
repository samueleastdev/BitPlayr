import { EDeviceType } from '../device-type';
import { Device } from '../base/device-base';
import { BrowserDetails } from '../browser/details';
import { BrowserDevice } from '../browser/device';
import { BrowserInputs } from '../browser/inputs';
import { TizenDetails } from '../tizen/details';
import { TizenDevice } from '../tizen/device';
import { TizenInputs } from '../tizen/inputs';
import { TizenWindow } from '../tizen/interfaces/common';

export class DeviceFactory {
  static createDevice(type: string, context: Window): Device {
    switch (type) {
      case EDeviceType.Browser:
        return new BrowserDevice(new BrowserInputs(context), new BrowserDetails(context));
      case EDeviceType.Tizen:
        return new TizenDevice(
          new TizenInputs(context as TizenWindow),
          new TizenDetails(context as TizenWindow),
        );
      default:
        throw new Error('Device type not supported!');
    }
  }
}
