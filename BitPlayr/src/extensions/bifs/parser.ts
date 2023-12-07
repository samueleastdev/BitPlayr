export const BIF_INDEX_OFFSET = 64;
export const FRAMEWISE_SEPARATION_OFFSET = 16;
export const NUMBER_OF_BIF_IMAGES_OFFSET = 12;
export const VERSION_OFFSET = 8;

export const BIF_INDEX_ENTRY_LENGTH = 8;

export const MAGIC_NUMBER = new Uint8Array([0x89, 0x42, 0x49, 0x46, 0x0d, 0x0a, 0x1a, 0x0a]);

function validate(magicNumber: Uint8Array): boolean {
  let isValid = true;

  MAGIC_NUMBER.forEach((byte, i) => {
    if (byte !== magicNumber[i]) {
      isValid = false;
      return;
    }
  });

  return isValid;
}

interface BIFIndexEntry {
  offset: number;
  timestamp: number;
  length: number;
}

export class BIFParser {
  private arrayBuffer: ArrayBuffer;
  private data: DataView;
  private framewiseSeparation: number;
  private numberOfBIFImages: number;
  private version: number;
  private bifIndex: BIFIndexEntry[];

  constructor(arrayBuffer: ArrayBuffer) {
    const magicNumber = new Uint8Array(arrayBuffer).slice(0, 8);

    if (!validate(magicNumber)) {
      throw new Error('Invalid BIF file.');
    }

    this.arrayBuffer = arrayBuffer;
    this.data = new DataView(arrayBuffer);

    this.framewiseSeparation = this.data.getUint32(FRAMEWISE_SEPARATION_OFFSET, true) || 1000;
    this.numberOfBIFImages = this.data.getUint32(NUMBER_OF_BIF_IMAGES_OFFSET, true);
    this.version = this.data.getUint32(VERSION_OFFSET, true);

    this.bifIndex = this.generateBIFIndex();
  }

  private generateBIFIndex(): BIFIndexEntry[] {
    const bifIndex: BIFIndexEntry[] = [];

    for (
      let i = 0, bifIndexEntryOffset = BIF_INDEX_OFFSET;
      i < this.numberOfBIFImages;
      i += 1, bifIndexEntryOffset += BIF_INDEX_ENTRY_LENGTH
    ) {
      const bifIndexEntryTimestampOffset = bifIndexEntryOffset;
      const bifIndexEntryAbsoluteOffset = bifIndexEntryOffset + 4;
      const nextBifIndexEntryAbsoluteOffset = bifIndexEntryAbsoluteOffset + BIF_INDEX_ENTRY_LENGTH;

      const offset = this.data.getUint32(bifIndexEntryAbsoluteOffset, true);
      const nextOffset = this.data.getUint32(nextBifIndexEntryAbsoluteOffset, true);
      const timestamp = this.data.getUint32(bifIndexEntryTimestampOffset, true);

      bifIndex.push({
        offset,
        timestamp,
        length: nextOffset - offset,
      });
    }

    return bifIndex;
  }

  public getImageDataAtSecond(second: number): string {
    const image = 'data:image/jpeg;base64,';
    const frameNumber = Math.floor(second / (this.framewiseSeparation / 1000));
    const frame = this.bifIndex[frameNumber];

    if (!frame) {
      return image;
    }

    const base64 = btoa(
      new Uint8Array(this.arrayBuffer.slice(frame.offset, frame.offset + frame.length)).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );

    return `${image}${base64}`;
  }
}
