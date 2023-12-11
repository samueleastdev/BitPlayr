import { SdkConfig } from '../../configs/sdkConfig';
import { IVideoService } from '../../core/interfaces/ICommon';
import { DashJsStrategy } from './dashjs';
import dashjs from 'dashjs';

const mockInitialize = jest.fn();

jest.mock('dashjs', () => ({
  MediaPlayer: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockReturnThis(),
    initialize: mockInitialize,
  })),
}));

describe('DashJsStrategy', () => {
  let dashJsStrategy: DashJsStrategy; // Specify the type
  let provider: IVideoService; // Specify the type
  const mockVideoElement = {
    /* Mock properties and methods of HTMLMediaElement */
  };

  beforeEach(() => {
    SdkConfig.setConfig({
      telemetryEnabled: false,
    });
    dashJsStrategy = new DashJsStrategy({
      global: {},
      dash: {},
    });
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'test-video-element') {
        return mockVideoElement as any;
      }
      return null;
    });
    provider = {
      manifestUrl: 'http://example.com/stream.mpd',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Dash.js player with the correct parameters', () => {
    const videoElementId = 'test-video-element';

    dashJsStrategy.createPlayer(videoElementId);
    dashJsStrategy.load(provider);

    expect(document.getElementById).toHaveBeenCalledWith(videoElementId);
    expect(dashjs.MediaPlayer().create().initialize).toHaveBeenCalledWith(
      mockVideoElement,
      provider.manifestUrl,
      true,
    );
  });

  it('should throw an error if the video element is not found', () => {
    const videoElementId = 'non-existent-element';

    expect(() => {
      dashJsStrategy.createPlayer(videoElementId);
      dashJsStrategy.load(provider);
    }).toThrow(`Element with ID '${videoElementId}' not found.`);
  });
});
