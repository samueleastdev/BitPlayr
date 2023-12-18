import { Device } from '../base/device-base';
import { BrowserDetails } from './details';
import { BrowserInputs } from './inputs';

export class BrowserDevice extends Device {
  constructor(inputs: BrowserInputs, details: BrowserDetails) {
    super(inputs, details);
  }
}
