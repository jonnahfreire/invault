import { VaultKeyAlgorithm } from "@domain/key/vault-key-algorithm";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

type Aes256EncryptedData = {
  iv: string;
  tag: string;
  cipher: string;
};

export type Aes256DecryptData = {
  key: string;
  iv: string;
  tag: string;
  cipher: string;
};

export class Aes256GcmEncrypter {
  private static readonly ALGORITHM = VaultKeyAlgorithm.AES_256_GCM;
  private static readonly IV_LENGTH = 12;

  public static encrypt(plaintext: string, key: Buffer): Aes256EncryptedData {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      cipher: encrypted.toString("hex"),
    };
  }

  public static decrypt(data: Aes256DecryptData): string {
    const ivHex = Buffer.from(data.iv, "hex");
    const tagHex = Buffer.from(data.tag, "hex");
    const decipher = createDecipheriv(this.ALGORITHM, Buffer.from(data.key, "hex"), ivHex);
    decipher.setAuthTag(tagHex);

    const decrypted = Buffer.concat([decipher.update(data.cipher, "hex"), decipher.final()]);
    return decrypted.toString("utf-8");
  }
}
