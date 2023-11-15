var ThumbnailPlugin = /** @class */ (function () {
    function ThumbnailPlugin() {
    }
    ThumbnailPlugin.prototype.apply = function (player) {
        player.on('timeupdate', this.handleTimeUpdate);
    };
    ThumbnailPlugin.prototype.handleTimeUpdate = function (currentTime) {
        // Logic to handle the time update...
        //console.log('ThumbnailPlugin', currentTime);
    };
    return ThumbnailPlugin;
}());
export { ThumbnailPlugin };
