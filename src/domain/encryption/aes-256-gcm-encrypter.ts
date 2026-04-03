import { VaultKeyAlgorithm } from "@domain/key/enum/vault-key-algorithm";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { Aes256DecryptException, Aes256EncryptException } from "./exceptions/aes-256.exception";

export type Aes256EncryptedData = {
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
    try {
      const iv = randomBytes(this.IV_LENGTH);
      const cipher = createCipheriv(this.ALGORITHM, key, iv);

      const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
      const tag = cipher.getAuthTag();

      return {
        iv: iv.toString("hex"),
        tag: tag.toString("hex"),
        cipher: encrypted.toString("hex"),
      };
    } catch {
      throw new Aes256EncryptException("[AES001] Failed to encrypt data");
    }
  }

  public static decrypt(data: Aes256DecryptData): string {
    try {
      const ivHex = Buffer.from(data.iv, "hex");
      const tagHex = Buffer.from(data.tag, "hex");
      const decipher = createDecipheriv(this.ALGORITHM, Buffer.from(data.key, "hex"), ivHex);
      decipher.setAuthTag(tagHex);

      const decrypted = Buffer.concat([decipher.update(data.cipher, "hex"), decipher.final()]);
      return decrypted.toString("utf-8");
    } catch {
      throw new Aes256DecryptException("[AES002] Failed to decrypt data");
    }
  }
}
