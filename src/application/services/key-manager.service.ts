import { Injectable } from "@nestjs/common";
import { ShareVault } from "../../domain/vault/share-vault";
import { KeyDerivation } from "@domain/key/key-derivation";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { Environment } from "@application/config/environment";
import { KekType } from "@domain/key/enum/kek-type.enum";

@Injectable()
export class KeyManagerService {
  private vault: ShareVault;

  constructor(private readonly environment: Environment) {
    this.vault = new ShareVault(this.environment.shamirThreshold);
  }

  addShare(share: string) {
    this.vault.addShare(Buffer.from(share, "hex"));
  }

  async deriveKEK(type: KekType): Promise<{ metadata: KeyEncryptionKey; material: Buffer<ArrayBuffer> }> {
    const metadata = KeyEncryptionKey.create(type, this.environment.nodeEnv);
    const material = KeyDerivation.deriveFrom(await this.vault.reconstructRK(), metadata.salt, type, metadata.env, metadata.version);
    this.vault.destroy();

    return { metadata, material };
  }

  generateRandomDEK() {
    return KeyDerivation.getRandom();
  }
}
