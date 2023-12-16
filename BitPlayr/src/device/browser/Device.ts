import { Device } from '../base/DeviceBase';
import { BrowserDetails } from './Details';
import { BrowserInputs } from './Inputs';

export class BrowserDevice extends Device {
  constructor(inputs: BrowserInputs, details: BrowserDetails) {
    super(inputs, details);
  }
}
