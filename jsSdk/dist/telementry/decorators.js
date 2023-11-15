import { SdkConfigService } from '../core/sdkConfig';
export function WithTelemetry(target, propertyKey, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!SdkConfigService.getConfig().telemetryEnabled) {
            return originalMethod.apply(this, args);
        }
        var start = performance.now();
        var result = originalMethod.apply(this, args);
        var finish = performance.now();
        console.log("Execution time for ".concat(String(propertyKey), ": ").concat(finish - start, " ms"));
        return result;
    };
    return descriptor;
}
