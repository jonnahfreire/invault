/// <reference types="jest" />

import { User } from "./user";
import { UserStatus } from "./enum/user-status.enum";
import { ClientAccount } from "./client-account";
import { UniqueId } from "../@common/uniqueid";

describe("User entity", () => {
  it("should create user with normalized email and active status", () => {
    const user = User.create({
      name: "Joana",
      email: "joana@exemplo.com ",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("Joana");
    expect(user.email).toBe("joana@exemplo.com");
    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.isActive()).toBe(true);
    expect(user.isSuspended()).toBe(false);
    expect(user.isRevoked()).toBe(false);
  });

  it("should reject create user with missing fields", () => {
    expect(() => User.create({ name: "", email: "" })).toThrow();
    expect(() => User.create({ name: "Name", email: "invalid-email" })).toThrow();
  });

  it("should allow status changes and account link", () => {
    const user = User.create({
      name: "Test",
      email: "t@t.com",
    });

    const account = ClientAccount.create(UniqueId.from("user-id-1"), "hashed-password", false);

    user.setAccount(account);
    expect(user.account).toEqual(account);

    user.suspend();
    expect(user.status).toBe(UserStatus.SUSPENDED);
    expect(user.isSuspended()).toBe(true);

    user.revoke();
    expect(user.status).toBe(UserStatus.REVOKED);
    expect(user.isRevoked()).toBe(true);
  });
});
