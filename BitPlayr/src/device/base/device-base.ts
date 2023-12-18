import { UAParser } from 'ua-parser-js';
import {
  IDeviceDetailsProvider,
  IDeviceDetailsSpec,
  IDeviceInputProvider,
  IDeviceInputSpec,
} from '../common/common';
import { IBrowserInfo } from '../interfaces/uaparser';

export abstract class Device {
  protected parser;

  constructor(
    protected inputs: IDeviceInputProvider,
    protected details: IDeviceDetailsProvider,
  ) {
    this.parser = new UAParser();
  }

  setupInputs(): Promise<IDeviceInputSpec> {
    return this.inputs.setupInputs();
  }

  getDeviceApi(): Promise<IDeviceDetailsSpec> {
    return this.details.getDeviceApi();
  }

  getInfo(): IBrowserInfo {
    const ua = this.parser.getResult();
    return ua;
  }
}
