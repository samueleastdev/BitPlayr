import { SdkConfigService } from '../core/sdkConfig';
import { DashJsStrategy } from './dashjs';
import dashjs from 'dashjs';
var mockInitialize = jest.fn();
jest.mock('dashjs', function () { return ({
    MediaPlayer: jest.fn().mockImplementation(function () { return ({
        create: jest.fn().mockReturnThis(),
        initialize: mockInitialize,
    }); }),
}); });
describe('DashJsStrategy', function () {
    var dashJsStrategy; // Specify the type
    var mockVideoElement = {
    /* Mock properties and methods of HTMLMediaElement */
    };
    beforeEach(function () {
        SdkConfigService.setConfig({
            telemetryEnabled: false,
        });
        dashJsStrategy = new DashJsStrategy();
        jest.spyOn(document, 'getElementById').mockImplementation(function (id) {
            if (id === 'test-video-element') {
                return mockVideoElement;
            }
            return null;
        });
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('should initialize Dash.js player with the correct parameters', function () {
        var videoElementId = 'test-video-element';
        var streamUrl = 'http://example.com/stream.mpd';
        dashJsStrategy.initialize(videoElementId, streamUrl);
        expect(document.getElementById).toHaveBeenCalledWith(videoElementId);
        expect(dashjs.MediaPlayer().create().initialize).toHaveBeenCalledWith(mockVideoElement, streamUrl, true);
    });
    it('should throw an error if the video element is not found', function () {
        var videoElementId = 'non-existent-element';
        var streamUrl = 'http://example.com/stream.mpd';
        expect(function () {
            dashJsStrategy.initialize(videoElementId, streamUrl);
        }).toThrow("Element with ID '".concat(videoElementId, "' not found."));
    });
});
