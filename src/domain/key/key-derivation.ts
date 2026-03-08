import { hkdfSync, randomBytes } from "node:crypto";

export enum KekType {
  DATABASE = "kek:database",
  CERTIFICATE = "kek:certificate",
  AIPKEY = "kek:apikey",
  JWT = "kek:jwt",
  SSH = "kek:ssh",
  KV = "kek:kv",
}

export class KeyDerivation {
  private static KEY_LENGTH = 32;
  private static KEY_INFO = "invault";

  static async deriveFrom(key: Buffer<ArrayBuffer>, salt: string, keytype: KekType | string, environment: string, version: number) {
    const keyInfo = Buffer.from(`${this.KEY_INFO}:${keytype}:${environment}:$${version}`);
    const derivedKey = hkdfSync("sha512", key, Buffer.from(salt), keyInfo, this.KEY_LENGTH);
    return Buffer.from(derivedKey);
  }

  static async getRandom(bytes: number = this.KEY_LENGTH) {
    return Buffer.from(randomBytes(bytes));
  }
}
