import { UAParser } from 'ua-parser-js';
import {
  IDeviceDetailsProvider,
  IDeviceDetailsSpec,
  IDeviceInputProvider,
  IDeviceInputSpec,
} from '../common/ICommon';
import { IBrowserInfo } from '../interfaces/IUaParser';

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

  getDeviceDetails(): Promise<IDeviceDetailsSpec> {
    return this.details.getDeviceDetails();
  }

  getInfo(): IBrowserInfo {
    const ua = this.parser.getResult();
    return ua;
  }
}
