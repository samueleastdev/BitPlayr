import { Player } from '../../core/basePlayer';
export interface IPlayerPlugin {
    apply(player: Player): void;
}
export interface SdkConfig {
    telemetryEnabled: boolean;
}
export interface PlayerConfig {
    player: string;
    plugins: IPlayerPlugin[];
    deviceCapabilities: {
        supportsAdvancedFeatures: boolean;
    };
    sdkConfig: SdkConfig;
}
//# sourceMappingURL=common.d.ts.map