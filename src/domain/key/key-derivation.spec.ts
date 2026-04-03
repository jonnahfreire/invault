/// <reference types="jest" />

import { KeyDerivation } from "./key-derivation";
import { KekType } from "./enum/kek-type.enum";

describe("KeyDerivation utility", () => {
  it("should derive key with valid parameters", () => {
    const masterKey = Buffer.from("master-key-32-bytes-long-string!");
    const salt = "test-salt";
    const keyType = KekType.KV;
    const environment = "test";
    const version = 1;

    const derivedKey = KeyDerivation.deriveFrom(masterKey, salt, keyType, environment, version);

    expect(derivedKey).toBeInstanceOf(Buffer);
    expect(derivedKey.length).toBe(32);
  });

  it("should generate random bytes", () => {
    const randomBytes = KeyDerivation.getRandom(16);

    expect(randomBytes).toBeInstanceOf(Buffer);
    expect(randomBytes.length).toBe(16);
  });

  it("should generate 32 bytes by default", () => {
    const randomBytes = KeyDerivation.getRandom();

    expect(randomBytes.length).toBe(32);
  });

  it("should produce consistent results for same inputs", () => {
    const masterKey = Buffer.from("consistent-master-key-32-bytes!");
    const salt = "consistent-salt";

    const key1 = KeyDerivation.deriveFrom(masterKey, salt, KekType.KV, "test", 1);
    const key2 = KeyDerivation.deriveFrom(masterKey, salt, KekType.KV, "test", 1);

    expect(key1.equals(key2)).toBe(true);
  });

  it("should produce different results for different inputs", () => {
    const masterKey = Buffer.from("different-master-key-32-bytes!");

    const key1 = KeyDerivation.deriveFrom(masterKey, "salt1", KekType.KV, "test", 1);
    const key2 = KeyDerivation.deriveFrom(masterKey, "salt2", KekType.KV, "test", 1);

    expect(key1.equals(key2)).toBe(false);
  });
});
