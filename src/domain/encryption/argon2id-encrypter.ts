import Argon, { argon2id } from "argon2";
import { ArgonEncryptException } from "./exceptions/argon2.exception";

export default class Argon2idEncrypter {
  private static argonOptions = {
    type: argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 2,
  };

  static async create(cipher: string): Promise<string> {
    if (!cipher || !cipher.length) throw new ArgonEncryptException("Cipher must not be null or empty");
    const hash = await Argon.hash(cipher, this.argonOptions);
    return hash;
  }

  static async validate(digest: string, plain: string): Promise<boolean> {
    return await Argon.verify(digest, plain);
  }
}
