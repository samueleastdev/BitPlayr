import { Player } from '../../core/basePlayer';
import { BasicConfig } from '../../service/basic/config/basic';
import { IPlayerExtension } from '../interfaces/ICommon';
import { BIFParser } from './parser';

export class BifsExtension implements IPlayerExtension {
  private player: Player | null;
  BIFParser?: BIFParser;

  constructor() {
    this.player = null;
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
  }

  apply(player: Player) {
    this.player = player;
    player.on('loadedmetadata', this.handleLoadedMetadata);
  }

  handleLoadedMetadata() {
    if (BasicConfig.getConfig() && BasicConfig.getConfig().bifData) {
      const bifData = BasicConfig.getConfig().bifData;
      if (bifData instanceof ArrayBuffer) {
        this.BIFParser = new BIFParser(bifData);
        console.log('this.BIFParser', this.BIFParser);
      } else if (bifData != null) {
        throw new Error('Invalid BIF data.');
      }
    }
  }

  getImageAtSecond(second: number): string {
    if (!this.BIFParser) {
      throw new Error('BIF Parser is not initialized');
    }
    return this.BIFParser.getImageDataAtSecond(second);
  }
}
