import { Aes256DecryptData, Aes256GcmEncrypter } from "./aes-256-gcm-encrypter";

type Aes256Wrap = {
  cipher: string;
  kek: Buffer;
  dek: Buffer;
};

type Aes256Unwrap = {
  data: Omit<Aes256DecryptData, "key">;
  dek: Aes256DecryptData;
};

export class Aes256Wrapper {
  static wrap(wrapData: Aes256Wrap) {
    const data = Aes256GcmEncrypter.encrypt(wrapData.cipher, wrapData.dek);
    const encryptedDEK = Aes256GcmEncrypter.encrypt(wrapData.dek.toString("hex"), wrapData.kek);
    return {
      cipherData: data,
      cipherDek: encryptedDEK,
    };
  }

  static unwrap(unWrapData: Aes256Unwrap): string {
    const decryptedDek = Aes256GcmEncrypter.decrypt(unWrapData.dek);
    const decryptedData = Aes256GcmEncrypter.decrypt({ ...unWrapData.data, key: decryptedDek });
    return decryptedData;
  }
}
