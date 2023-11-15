var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter } from 'events';
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(playerStrategy) {
        var _this = _super.call(this) || this;
        _this.playerStrategy = playerStrategy;
        return _this;
    }
    Player.prototype.initialize = function (videoElementId, streamUrl) {
        var _this = this;
        this.playerStrategy.initialize(videoElementId, streamUrl);
        this.playerStrategy.onTimeUpdate(function (time) { return _this.emit('timeupdate', time); });
        this.playerStrategy.onSeeked(function (time) { return _this.emit('seeked', time); });
    };
    Player.prototype.play = function () {
        this.playerStrategy.play();
    };
    Player.prototype.pause = function () {
        this.playerStrategy.pause();
    };
    Player.prototype.fullscreen = function () {
        this.playerStrategy.fullscreen();
    };
    return Player;
}(EventEmitter));
export { Player };
