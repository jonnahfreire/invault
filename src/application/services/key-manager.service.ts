import { Injectable } from "@nestjs/common";
import { ShareVault } from "../../domain/vault/share-vault";
import { KeyDerivation } from "@domain/key/key-derivation";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { Environment } from "@application/config/environment";

@Injectable()
export class KeyManagerService {
  private vault: ShareVault;

  constructor(private readonly environment: Environment) {
    this.vault = new ShareVault(this.environment.shamirThreshold);
  }

  addShare(share: string) {
    this.vault.addShare(Buffer.from(share, "hex"));
  }

  async deriveKEK(context: KeyEncryptionKey): Promise<Buffer<ArrayBuffer>> {
    const kek = KeyDerivation.deriveFrom(await this.vault.reconstructRK(), context.salt, context.type, context.env, context.version);
    this.vault.destroy();

    return kek;
  }

  generateRandomDEK() {
    return KeyDerivation.getRandom();
  }
}
