import { ShamirSecretSharing } from "@domain/key/shamir-secret-sharing";
import { SecureBuffer } from "./secure-buffer";

export class ShareVault {
  private shares: SecureBuffer[] = [];
  private readonly threshold: number;
  private readonly timeout?: NodeJS.Timeout;
  private readonly preserveShares: boolean;

  constructor(threshold: number, preserveShares: boolean = true, ttlMs: number = 30000) {
    this.threshold = threshold;
    this.preserveShares = preserveShares;

    this.timeout = setTimeout(() => {
      this.destroy();
    }, ttlMs);
  }

  addShare(share: Buffer) {
    if (this.shares.length >= this.threshold) {
      throw new Error("Threshold reached");
    }

    this.shares.push(SecureBuffer.from(share));
  }

  isReady(): boolean {
    return this.shares.length >= this.threshold;
  }

  getShares(): Buffer[] {
    if (!this.isReady()) {
      throw new Error("Not enough shares");
    }

    return this.shares.map((s) => s.value);
  }

  async reconstructRK(): Promise<Buffer<ArrayBuffer>> {
    return Buffer.from(await ShamirSecretSharing.reconstruct(this.getShares()));
  }

  destroy() {
    if (!this.preserveShares) {
      for (const share of this.shares) {
        share.destroy();
      }

      this.shares = [];
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
