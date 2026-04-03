/// <reference types="jest" />

import { SecretVersion } from "./secret-version";
import { UniqueId } from "../@common/uniqueid";

describe("SecretVersion entity", () => {
  it("should create a valid secret version", () => {
    const secretId = UniqueId.create("secret-123");
    const dekId = UniqueId.create("dek-123");

    const version = SecretVersion.create({
      secretId,
      dekId,
      payload: "encrypted-payload",
      version: 1,
    });

    expect(version).toBeDefined();
    expect(version.secretId).toBe(secretId);
    expect(version.dekId).toBe(dekId);
    expect(version.payload).toBe("encrypted-payload");
    expect(version.version).toBe(1);
    expect(version.createdAt).toBeInstanceOf(Date);
  });

  it("should reject creation when required fields are missing", () => {
    expect(() =>
      SecretVersion.create({
        secretId: undefined as any,
        dekId: undefined as any,
        payload: "",
        version: 0,
      }),
    ).toThrow();
  });

  it("should reject expiration dates in the past", () => {
    const secretId = UniqueId.create("secret-123");
    const dekId = UniqueId.create("dek-123");

    expect(() =>
      SecretVersion.create({
        secretId,
        dekId,
        payload: "payload",
        version: 1,
        expiresAt: new Date(Date.now() - 1000),
      }),
    ).toThrow(/Expiration date must be in the future/);
  });
});
