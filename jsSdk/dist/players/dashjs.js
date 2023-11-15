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
import dashjs from 'dashjs';
import { BasePlayerStrategy } from '../core/basePlayerStrategy';
import { WithTelemetry } from '../telementry/decorators';
var DashJsStrategy = /** @class */ (function (_super) {
    __extends(DashJsStrategy, _super);
    function DashJsStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DashJsStrategy.prototype.initialize = function (videoElementId, streamUrl) {
        this.videoElement = document.getElementById(videoElementId);
        if (!this.videoElement) {
            throw new Error("Element with ID '".concat(videoElementId, "' not found."));
        }
        this.dashPlayer = dashjs.MediaPlayer().create();
        this.dashPlayer.initialize(this.videoElement, streamUrl, true);
    };
    __decorate([
        WithTelemetry
    ], DashJsStrategy.prototype, "initialize", null);
    return DashJsStrategy;
}(BasePlayerStrategy));
export { DashJsStrategy };
