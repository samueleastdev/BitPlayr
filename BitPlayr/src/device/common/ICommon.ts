import { IBrowserInfo } from '../interfaces/IUaParser';

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
  getDeviceDetails(): Promise<IDeviceDetailsSpec>;
}

export interface IDeviceDetails {
  type: string;
  inputs: IDeviceInputSpec;
  details: IDeviceDetailsSpec;
  ua: IBrowserInfo;
}
