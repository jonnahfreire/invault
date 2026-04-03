/// <reference types="jest" />

import { Permission, Action, ResourceType } from "./permission";

describe("Permission entity", () => {
  it("should create permission with enum values", () => {
    const permission = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.READ,
    });

    expect(permission).toBeDefined();
    expect(permission.props.resource).toBe(ResourceType.SECRET);
    expect(permission.props.action).toBe(Action.READ);
  });

  it("should create permission with custom string values", () => {
    const permission = Permission.create({
      resource: "custom-resource",
      action: "custom-action",
    });

    expect(permission.props.resource).toBe("custom-resource");
    expect(permission.props.action).toBe("custom-action");
  });

  it("should compare permissions correctly", () => {
    const permission1 = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.READ,
    });

    const permission2 = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.READ,
    });

    const permission3 = Permission.create({
      resource: ResourceType.SECRET,
      action: Action.UPDATE,
    });

    expect(permission1.equals(permission2)).toBe(true);
    expect(permission1.equals(permission3)).toBe(false);
  });

  it("should return organization owner default permissions", () => {
    const permission = new Permission({ resource: "", action: "" });
    const defaults = permission.organizationOwnerDefaults();

    expect(defaults).toHaveLength(4);
    expect(defaults.some((p) => p.props.action === "read" && p.props.resource === "organization")).toBe(true);
    expect(defaults.some((p) => p.props.action === "create" && p.props.resource === "organization")).toBe(true);
    expect(defaults.some((p) => p.props.action === "update" && p.props.resource === "organization")).toBe(true);
    expect(defaults.some((p) => p.props.action === "delete" && p.props.resource === "organization")).toBe(true);
  });
});
