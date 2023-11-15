var SdkConfigService = /** @class */ (function () {
    function SdkConfigService() {
    }
    SdkConfigService.setConfig = function (newConfig) {
        SdkConfigService.config = newConfig;
    };
    SdkConfigService.getConfig = function () {
        return SdkConfigService.config;
    };
    return SdkConfigService;
}());
export { SdkConfigService };
