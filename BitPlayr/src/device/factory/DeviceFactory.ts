import { EDeviceType } from '../DeviceType';
import { Device } from '../base/DeviceBase';
import { BrowserDetails } from '../browser/Details';
import { BrowserDevice } from '../browser/Device';
import { BrowserInputs } from '../browser/Inputs';
import { TizenDetails } from '../tizen/Details';
import { TizenDevice } from '../tizen/Device';
import { TizenInputs } from '../tizen/Inputs';
import { TizenWindow } from '../tizen/interfaces/ICommon';

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
