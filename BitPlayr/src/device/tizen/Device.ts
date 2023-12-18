import { Device } from '../base/device-base';
import { TizenDetails } from './details';
import { TizenInputs } from './inputs';

export class TizenDevice extends Device {
  constructor(inputs: TizenInputs, details: TizenDetails) {
    super(inputs, details);
  }
}
