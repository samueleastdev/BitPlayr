import { BasePlayer } from '../../player/base/base-player';
import { BasicConfig } from '../../service/basic/config/basic';
import { IPlayerExtension } from '../interfaces/common';
import { BIFParser } from './parser';

export class BifsExtension implements IPlayerExtension {
  private player: BasePlayer | null;
  BIFParser?: BIFParser;

  constructor() {
    this.player = null;
    this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
  }

  apply(player: BasePlayer) {
    this.player = player;
    console.log('DEVICE INFO: ', this.player.getDeviceInfo());
    player.on('loadedmetadata', this.handleLoadedMetadata);
  }

  handleLoadedMetadata() {
    if (BasicConfig.getConfig() && BasicConfig.getConfig().bifData) {
      const bifData = BasicConfig.getConfig().bifData;
      if (bifData instanceof ArrayBuffer) {
        this.BIFParser = new BIFParser(bifData);
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
