import { IDeviceInputProvider, IDeviceInputSpec } from '../common/ICommon';

export class BrowserInputs implements IDeviceInputProvider {
  constructor(private context: Window) {
    this.context = context;
  }

  setupInputs(): Promise<IDeviceInputSpec> {
    const inputs: IDeviceInputSpec = {
      inputType: 'Touch',
      inputDescription: 'Touchscreen Input',
    };

    return Promise.resolve(inputs);
  }
}
