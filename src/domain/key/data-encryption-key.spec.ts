/// <reference types="jest" />

import { DataEncryptionKey } from "./data-encryption-key";

describe("DataEncryptionKey entity", () => {
  it("should create data encryption key with valid parameters", () => {
    const kekVersion = 1;
    const iv = "iv-hex-string";
    const tag = "tag-hex-string";
    const cipher = "cipher-hex-string";

    const dek = DataEncryptionKey.create(kekVersion, iv, tag, cipher);

    expect(dek).toBeDefined();
    expect(dek.kekVersion).toBe(kekVersion);
    expect(dek.iv).toBe(iv);
    expect(dek.tag).toBe(tag);
    expect(dek.cipher).toBe(cipher);
    expect(dek.props.createdAt).toBeInstanceOf(Date);
  });

  it("should access properties correctly", () => {
    const dek = DataEncryptionKey.create(2, "iv", "tag", "cipher");

    expect(dek.kekVersion).toBe(2);
    expect(dek.iv).toBe("iv");
    expect(dek.tag).toBe("tag");
    expect(dek.cipher).toBe("cipher");
  });
});
