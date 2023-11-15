import { IPlayerStrategy } from '../players/interfaces/iPlayers';
export declare abstract class BasePlayerStrategy implements IPlayerStrategy {
    protected videoElement: HTMLMediaElement;
    abstract initialize(videoElementId: string, streamUrl: string): void;
    onTimeUpdate(callback: (time: number) => void): void;
    onSeeked(callback: (time: number) => void): void;
    fullscreen(): void;
    play(): void;
    pause(): void;
}
//# sourceMappingURL=basePlayerStrategy.d.ts.map