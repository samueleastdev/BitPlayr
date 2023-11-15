var BasePlayerStrategy = /** @class */ (function () {
    function BasePlayerStrategy() {
    }
    BasePlayerStrategy.prototype.onTimeUpdate = function (callback) {
        var _this = this;
        this.videoElement.addEventListener('timeupdate', function () {
            callback(_this.videoElement.currentTime);
        });
    };
    BasePlayerStrategy.prototype.onSeeked = function (callback) {
        var _this = this;
        this.videoElement.addEventListener('seeked', function () {
            callback(_this.videoElement.currentTime);
        });
    };
    BasePlayerStrategy.prototype.fullscreen = function () {
        if (this.videoElement) {
            this.videoElement.requestFullscreen();
        }
    };
    BasePlayerStrategy.prototype.play = function () {
        if (this.videoElement) {
            this.videoElement.play();
        }
    };
    BasePlayerStrategy.prototype.pause = function () {
        if (this.videoElement) {
            this.videoElement.pause();
        }
    };
    return BasePlayerStrategy;
}());
export { BasePlayerStrategy };
