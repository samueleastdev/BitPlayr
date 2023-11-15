import { SdkConfigService } from '../core/sdkConfig';

export function WithTelemetry(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (!SdkConfigService.getConfig().telemetryEnabled) {
      return originalMethod.apply(this, args);
    }

    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const finish = performance.now();

    console.log(`Execution time for ${String(propertyKey)}: ${finish - start} ms`);

    return result;
  };

  return descriptor;
}
