/// <reference types="jest" />

import { PasswordCredential } from "./password-credential";
import { UniqueId } from "../@common/uniqueid";

describe("PasswordCredential entity", () => {
  it("should create password credential with valid hash", () => {
    const identityId = UniqueId.create("identity-123");
    const passwordHash = "hashed-password-123";

    const credential = PasswordCredential.create({
      identityId,
      passwordHash,
    });

    expect(credential).toBeDefined();
    expect(credential.props.identityId).toBe(identityId);
    expect(credential.props.passwordHash).toBe(passwordHash);
    expect(credential.props.createdAt).toBeInstanceOf(Date);
  });

  it("should throw error when password hash is missing", () => {
    const identityId = UniqueId.create("identity-123");

    expect(() =>
      PasswordCredential.create({
        identityId,
        passwordHash: "",
      }),
    ).toThrow("Password hash is required");
  });
});
