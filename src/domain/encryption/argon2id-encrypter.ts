import Argon, { argon2id } from "argon2";

export default class Argon2idEncrypter {
  private static argonOptions = {
    type: argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 2,
  };

  static async create(cipher: string): Promise<string> {
    if (!cipher || !cipher.length) throw new Error("Cipher must not be null or empty");
    const hash = await Argon.hash(cipher, this.argonOptions);
    return hash;
  }

  async validate(digest: string, plain: string): Promise<boolean> {
    return await Argon.verify(digest, plain);
  }
}
