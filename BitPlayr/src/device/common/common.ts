import { EDeviceType } from '../device-type';
import { IBrowserInfo } from '../interfaces/uaparser';

export interface IDeviceInputSpec {
  inputType: string;
  inputDescription: string;
}

export interface IDeviceInputProvider {
  setupInputs(): Promise<IDeviceInputSpec>;
}

export interface IDeviceDetailsSpec {
  manufacturer: string;
  model: string;
}

export interface IDeviceDetailsProvider {
  getDeviceApi(): Promise<IDeviceDetailsSpec>;
}

export interface IDeviceDetails {
  deviceType: EDeviceType;
  inputs: IDeviceInputSpec;
  details: IDeviceDetailsSpec;
  ua: IBrowserInfo;
}
