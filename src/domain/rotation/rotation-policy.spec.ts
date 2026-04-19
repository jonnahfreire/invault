/// <reference types="jest" />

import { RotationPolicy, RotationStrategy } from "./rotation-policy";
import { UniqueId } from "../@common/uniqueid";

describe("RotationPolicy entity", () => {
  it("should create time-based rotation policy", () => {
    const secretId = UniqueId.from("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.TIME_BASED, 86400000); // 24 hours

    expect(policy).toBeDefined();
    expect(policy.secretId).toBe(secretId);
    expect(policy.strategy).toBe(RotationStrategy.TIME_BASED);
    expect(policy.interval).toBe(86400000);
  });

  it("should create usage-based rotation policy", () => {
    const secretId = UniqueId.from("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.USAGE_BASED, undefined, 100);

    expect(policy.strategy).toBe(RotationStrategy.USAGE_BASED);
    expect(policy.maxUses).toBe(100);
    expect(policy.interval).toBeUndefined();
  });

  it("should create policy with both interval and max uses", () => {
    const secretId = UniqueId.from("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.TIME_BASED, 3600000, 50);

    expect(policy.interval).toBe(3600000);
    expect(policy.maxUses).toBe(50);
  });
});
