import { combine, split } from "shamir-secret-sharing";

export abstract class IShamirSecretSharing {
  abstract create(secret: string): Promise<Uint8Array<ArrayBufferLike>[]>;
  abstract reconstruct(shares: string[]): Promise<string>;
  abstract shareToString(shares: Uint8Array<ArrayBufferLike>[]): string[];
}

export class ShamirSecretSharing implements IShamirSecretSharing {
  constructor(
    private readonly threshold: number,
    private readonly shareCount: number,
  ) {}

  async create(secret: string): Promise<Uint8Array<ArrayBufferLike>[]> {
    if (!secret || !secret.length) throw new Error("Secret must not be null or empty");
    if (!this.shareCount) throw new Error("ShareCount must not be null or zero");
    if (!this.threshold) throw new Error("Threshold must not be null or zero");

    const bsecret = Buffer.from(secret);
    const uint8Secret = new Uint8Array(bsecret.buffer, bsecret.byteOffset, bsecret.byteLength);
    const shares = await split(uint8Secret, this.shareCount, this.threshold);
    return shares;
  }

  async reconstruct(shares: string[]): Promise<string> {
    if (!shares.length) throw new Error("Shares are required");

    const sharesToCombine: Uint8Array<ArrayBufferLike>[] = [];
    for (const sh of shares) {
      const bsh = Buffer.from(sh, "hex");
      sharesToCombine.push(new Uint8Array(bsh));
    }

    const reconstructedUint8Array = await combine(sharesToCombine);
    const reconstructed = Buffer.from(reconstructedUint8Array).toString("utf-8");
    return reconstructed;
  }

  shareToString(shares: Uint8Array<ArrayBufferLike>[]): string[] {
    return shares.map((s) => Buffer.from(s).toString("hex"));
  }
}
