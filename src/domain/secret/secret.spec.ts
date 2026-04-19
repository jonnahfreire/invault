/// <reference types="jest" />

import { Secret } from "./secret";
import { SecretVersion } from "./secret-version";
import { SecretType } from "./enum/secret-type.enum";
import { SecretOwner } from "./enum/secret-owner.enum";
import { SecretStatus } from "./enum/secret-status.enum";
import { UniqueId } from "../@common/uniqueid";

describe("Secret entity", () => {
  it("should create a secret with default active status", () => {
    const ownerId = UniqueId.from("owner-123");

    const secret = Secret.create({
      name: "demo-secret",
      type: SecretType.KV,
      ownerType: SecretOwner.SYSTEM,
      ownerId,
      createdBy: "tester",
    });

    expect(secret).toBeDefined();
    expect(secret.name).toBe("demo-secret");
    expect(secret.type).toBe(SecretType.KV);
    expect(secret.ownerId).toBe(ownerId);
    expect(secret.status).toBe(SecretStatus.ACTIVE);
    expect(secret.isActive()).toBe(true);
    expect(secret.isRevoked()).toBe(false);
  });

  it("should reject creating a secret when required props are missing", () => {
    const ownerId = UniqueId.from("owner-123");

    expect(() =>
      Secret.create({
        name: "",
        type: SecretType.KV,
        ownerType: SecretOwner.SYSTEM,
        ownerId,
      }),
    ).toThrow();

    expect(() =>
      Secret.create({
        name: "name",
        type: undefined as any,
        ownerType: SecretOwner.SYSTEM,
        ownerId,
      }),
    ).toThrow();
  });

  it("should forbid APIKEY and DATABASE secret owners as USER", () => {
    const ownerId = UniqueId.from("owner-123");

    expect(() =>
      Secret.create({
        name: "apikey",
        type: SecretType.APIKEY,
        ownerType: SecretOwner.USER,
        ownerId,
      }),
    ).toThrow();

    expect(() =>
      Secret.create({
        name: "db-secret",
        type: SecretType.DATABASE,
        ownerType: SecretOwner.USER,
        ownerId,
      }),
    ).toThrow();
  });

  it("should revoke secret and set current version", () => {
    const ownerId = UniqueId.from("owner-123");
    const secret = Secret.create({
      name: "demo-secret",
      type: SecretType.KV,
      ownerType: SecretOwner.SYSTEM,
      ownerId,
    });

    expect(secret.isActive()).toBe(true);

    secret.revoke();
    expect(secret.status).toBe(SecretStatus.REVOKED);
    expect(secret.isRevoked()).toBe(true);

    const dekId = UniqueId.from("dek-1");
    const secretVersion = SecretVersion.create({
      secretId: ownerId,
      dekId,
      payload: "value",
      version: 1,
    });

    secret.setCurrentVersion(secretVersion);
    expect(secret.currentVersionId?.toString()).toEqual(secretVersion.id.toString());
    expect(secret.versions.length).toBe(1);
    expect(secret.currentVersion?.id.toString()).toEqual(secretVersion.id.toString());

    // adding an existing version again should not duplicate
    secret.setCurrentVersion(secretVersion);
    expect(secret.versions.length).toBe(1);
  });
});
