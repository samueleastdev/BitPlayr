/// <reference types="node" />
import { EventEmitter } from 'events';
import { IPlayerStrategy } from '../players/interfaces/iPlayers';
export declare class Player extends EventEmitter {
    private playerStrategy;
    constructor(playerStrategy: IPlayerStrategy);
    initialize(videoElementId: string, streamUrl: string): void;
    play(): void;
    pause(): void;
    fullscreen(): void;
}
//# sourceMappingURL=basePlayer.d.ts.map