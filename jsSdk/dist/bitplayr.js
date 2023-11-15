import { Player } from './core/basePlayer';
import { SdkConfigService } from './core/sdkConfig';
import { DashJsStrategy } from './players/dashjs';
import { HlsJsStrategy } from './players/hlsjs'; // Import if you're using HlsJsStrategy
import { VideoJsStrategy } from './players/videojs';
var BitPlayrFactory = /** @class */ (function () {
    function BitPlayrFactory() {
    }
    BitPlayrFactory.createPlayer = function (config) {
        SdkConfigService.setConfig(config.sdkConfig);
        var strategy = BitPlayrFactory.getStrategy(config.player);
        var player = new Player(strategy);
        config.plugins.forEach(function (plugin) {
            plugin.apply(player);
        });
        return player;
    };
    BitPlayrFactory.getStrategy = function (playerType) {
        switch (playerType) {
            case 'hls.js':
                return new HlsJsStrategy();
            case 'dash.js':
                return new DashJsStrategy();
            case 'video.js':
                return new VideoJsStrategy();
            default:
                throw new Error("Unsupported player type: ".concat(playerType));
        }
    };
    return BitPlayrFactory;
}());
export { BitPlayrFactory };
