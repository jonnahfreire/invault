import { ShamirSecretSharing } from "@domain/key/shamir-secret-sharing";
import { SecureBuffer } from "./secure-buffer";
import { VaultException } from "./exception/vault.exception";

export class ShareVault {
  private shares: SecureBuffer[] = [];
  private readonly threshold: number;
  private timeout?: NodeJS.Timeout;
  private readonly preserveShares: boolean;
  private readonly ttlMs: number;

  constructor(threshold: number, preserveShares: boolean = true, ttlMs: number = 30000) {
    this.threshold = threshold;
    this.preserveShares = preserveShares;
    this.ttlMs = ttlMs;
    this.startTimeout();
  }

  private startTimeout() {
    this.timeout = setTimeout(() => {
      this.destroy();
    }, this.ttlMs);
  }

  addShare(share: Buffer) {
    if (this.shares.length >= this.threshold) return;
    if (this.shares.some((s) => s.value.toString("hex") === share.toString("hex"))) throw new VaultException("Shares must be unique");
    this.shares.push(SecureBuffer.from(share));
  }

  reseal() {
    this.destroy(true);
    this.startTimeout();
  }

  isReady(): boolean {
    return this.shares.length >= this.threshold;
  }

  getShares(): Buffer[] {
    if (!this.isReady()) {
      throw new VaultException("Vault is sealed.");
    }

    return this.shares.map((s) => s.value);
  }

  async reconstructRK(): Promise<Buffer<ArrayBuffer>> {
    return Buffer.from(await ShamirSecretSharing.reconstruct(this.getShares()));
  }

  getStatus() {
    return {
      sharesLoaded: this.shares.length,
      threshold: this.threshold,
      sealed: !this.isReady(),
    };
  }

  destroy(forceDestroy: boolean = false) {
    if (!this.preserveShares || forceDestroy) {
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
