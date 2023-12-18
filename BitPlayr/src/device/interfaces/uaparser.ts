export interface IBrowserInfo {
  ua?: string;
  browser?: IBrowser;
  engine?: IEngine;
  os?: IOS;
  device?: IDevice;
  cpu?: ICPU;
}

interface IBrowser {
  name?: string;
  version?: string;
  major?: string;
}

interface IEngine {
  name?: string;
  version?: string;
}

interface IOS {
  name?: string;
  version?: string;
}

interface IDevice {
  vendor?: string;
  model?: string;
}

interface ICPU {}
