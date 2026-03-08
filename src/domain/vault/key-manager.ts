import { ShareVault } from "./share-vault";
import { ShamirSecretSharing } from "@domain/key/shamir-secret-sharing";
import { KekType, KeyDerivation } from "@domain/key/key-derivation";

type KeyContext = {
  salt: string;
  env: string;
  keytype: KekType | string;
  keyVersion: number;
};

export class KeyManager {
  private vault: ShareVault;

  constructor(threshold: number) {
    this.vault = new ShareVault(threshold);
  }

  addShare(share: string) {
    this.vault.addShare(Buffer.from(share, "hex"));
  }

  async deriveKEK(context: KeyContext): Promise<Buffer<ArrayBuffer>> {
    const shares = this.vault.getShares();
    const rootKey = Buffer.from(await ShamirSecretSharing.reconstruct(shares));

    const kek = KeyDerivation.deriveFrom(rootKey, context.salt, context.keytype, context.env, context.keyVersion);
    this.vault.destroy();

    return kek;
  }

  generateRandomDEK() {
    return KeyDerivation.getRandom();
  }
}
