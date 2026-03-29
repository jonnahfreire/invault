import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

export class EncryptionService {
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  public static encrypt(plaintext: string, key: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, this.deriveKey(key), iv);

    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    // Return iv + tag + encrypted
    return iv.toString("hex") + tag.toString("hex") + encrypted;
  }

  public static decrypt(encryptedData: string, key: string): string {
    const iv = Buffer.from(encryptedData.slice(0, this.IV_LENGTH * 2), "hex");
    const tag = Buffer.from(encryptedData.slice(this.IV_LENGTH * 2, (this.IV_LENGTH + this.TAG_LENGTH) * 2), "hex");
    const encrypted = encryptedData.slice((this.IV_LENGTH + this.TAG_LENGTH) * 2);

    const decipher = createDecipheriv(this.ALGORITHM, this.deriveKey(key), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  private static deriveKey(password: string): Buffer {
    return scryptSync(password, "salt", this.KEY_LENGTH); // TODO: Melhorar a forma como é gerado o SALT e utilizado
  }
}
