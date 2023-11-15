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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Hls from 'hls.js';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';
var HlsJsStrategy = /** @class */ (function (_super) {
    __extends(HlsJsStrategy, _super);
    function HlsJsStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HlsJsStrategy.prototype.initialize = function (videoElementId, streamUrl) {
        this.videoElement = document.getElementById(videoElementId);
        if (!this.videoElement) {
            throw new Error("Element with ID '".concat(videoElementId, "' not found."));
        }
        if (Hls.isSupported()) {
            this.hlsPlayer = new Hls();
            this.hlsPlayer.loadSource(streamUrl);
            this.hlsPlayer.attachMedia(this.videoElement);
        }
        else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = streamUrl;
        }
    };
    __decorate([
        WithTelemetry
    ], HlsJsStrategy.prototype, "initialize", null);
    return HlsJsStrategy;
}(BasePlayerStrategy));
export { HlsJsStrategy };
