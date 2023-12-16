import { Device } from '../base/DeviceBase';
import { TizenDetails } from './Details';
import { TizenInputs } from './Inputs';

export class TizenDevice extends Device {
  constructor(inputs: TizenInputs, details: TizenDetails) {
    super(inputs, details);
  }
}
