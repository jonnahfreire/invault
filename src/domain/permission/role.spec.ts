/// <reference types="jest" />

import { Role } from "./role";
import { Permission, Action, ResourceType } from "./permission";
import { UniqueId } from "../@common/uniqueid";

describe("Role entity", () => {
  it("should create role with basic properties", () => {
    const organizationId = UniqueId.from("org-123");

    const role = Role.create({
      name: "admin",
      organizationId,
      permissions: [],
    });

    expect(role).toBeDefined();
    expect(role.props.name).toBe("admin");
    expect(role.props.organizationId).toBe(organizationId);
    expect(role.permissions).toEqual([]);
    expect(role.generic).toBe(false);
  });

  it("should create generic role without organization", () => {
    const role = Role.create({
      name: "system-admin",
      organizationId: null,
      permissions: [],
    });

    expect(role.generic).toBe(true);
  });

  it("should add permissions to role", () => {
    const role = Role.create({
      name: "user",
      permissions: [],
    });

    const permission1 = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.READ,
    });

    const permission2 = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.UPDATE,
    });

    role.addPermission(permission1);
    role.addPermission(permission2);

    expect(role.permissions).toHaveLength(2);
    expect(role.permissions).toContain(permission1);
    expect(role.permissions).toContain(permission2);
  });

  it("should not add duplicate permissions", () => {
    const role = Role.create({
      name: "user",
      permissions: [],
    });

    const permission = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.READ,
    });

    role.addPermission(permission);
    role.addPermission(permission); // Duplicate

    expect(role.permissions).toHaveLength(1);
  });
});
