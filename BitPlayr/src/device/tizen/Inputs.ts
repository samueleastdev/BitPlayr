import { IDeviceInputProvider, IDeviceInputSpec } from '../common/common';
import { TizenWindow } from './interfaces/common';

const TizenKeys: Array<string> = [
  'MediaPause',
  'MediaPlay',
  'MediaPlayPause',
  'MediaFastForward',
  'MediaRewind',
  'MediaStop',
  'ColorF0Red',
  'ColorF1Green',
  'ColorF2Yellow',
  'ColorF3Blue',
  'ChannelUp',
  'ChannelDown',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

export class TizenInputs implements IDeviceInputProvider {
  constructor(private context: TizenWindow) {
    this.context = context;
    if (typeof this.context.tizen !== 'undefined') {
      TizenKeys.forEach((key: string): void => {
        this.context.tizen.tvinputdevice.registerKey(key);
      });
    }
  }

  setupInputs(): Promise<IDeviceInputSpec> {
    const inputs: IDeviceInputSpec = {
      inputType: 'Touch',
      inputDescription: 'Touchscreen Input',
    };

    return Promise.resolve(inputs);
  }
}
