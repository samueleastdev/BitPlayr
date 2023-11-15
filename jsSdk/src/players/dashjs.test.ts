import { SdkConfigService } from '../core/sdkConfig';
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
  const mockVideoElement = {
    /* Mock properties and methods of HTMLMediaElement */
  };

  beforeEach(() => {
    SdkConfigService.setConfig({
      telemetryEnabled: false,
    });
    dashJsStrategy = new DashJsStrategy();
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      if (id === 'test-video-element') {
        return mockVideoElement as any;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Dash.js player with the correct parameters', () => {
    const videoElementId = 'test-video-element';
    const streamUrl = 'http://example.com/stream.mpd';

    dashJsStrategy.initialize(videoElementId, streamUrl);

    expect(document.getElementById).toHaveBeenCalledWith(videoElementId);
    expect(dashjs.MediaPlayer().create().initialize).toHaveBeenCalledWith(
      mockVideoElement,
      streamUrl,
      true,
    );
  });

  it('should throw an error if the video element is not found', () => {
    const videoElementId = 'non-existent-element';
    const streamUrl = 'http://example.com/stream.mpd';

    expect(() => {
      dashJsStrategy.initialize(videoElementId, streamUrl);
    }).toThrow(`Element with ID '${videoElementId}' not found.`);
  });
});
