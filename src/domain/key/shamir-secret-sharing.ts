import { combine, split } from "shamir-secret-sharing";
import CreateShamirException from "./exceptions/shamir.exception";

export class ShamirSecretSharing {
  static async create(secret: string, threshold: number, shareCount: number): Promise<Uint8Array<ArrayBufferLike>[]> {
    if (!secret || !secret.length) throw new CreateShamirException("Secret must not be null or empty");
    if (!shareCount) throw new CreateShamirException("ShareCount must not be null or zero");
    if (!threshold) throw new CreateShamirException("Threshold must not be null or zero");

    const bsecret = Buffer.from(secret);
    const uint8Secret = new Uint8Array(bsecret.buffer, bsecret.byteOffset, bsecret.byteLength);
    const shares = await split(uint8Secret, shareCount, threshold);
    return shares;
  }

  static async reconstruct(shares: Buffer[]): Promise<string> {
    if (!shares.length) throw new CreateShamirException("Shares are required");

    const sharesToCombine: Uint8Array<ArrayBufferLike>[] = [];
    for (const sh of shares) {
      sharesToCombine.push(new Uint8Array(sh));
    }

    const reconstructedUint8Array = await combine(sharesToCombine);
    const reconstructed = Buffer.from(reconstructedUint8Array).toString("utf-8");
    return reconstructed;
  }

  shareToString(shares: Uint8Array<ArrayBufferLike>[]): string[] {
    return shares.map((s) => Buffer.from(s).toString("hex"));
  }
}
