/// <reference types="jest" />

import { RotationPolicy, RotationStrategy } from "./rotation-policy";
import { UniqueId } from "../@common/uniqueid";

describe("RotationPolicy entity", () => {
  it("should create time-based rotation policy", () => {
    const secretId = UniqueId.create("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.TIME_BASED, 86400000); // 24 hours

    expect(policy).toBeDefined();
    expect(policy.props.secretId).toBe(secretId);
    expect(policy.props.strategy).toBe(RotationStrategy.TIME_BASED);
    expect(policy.props.interval).toBe(86400000);
  });

  it("should create usage-based rotation policy", () => {
    const secretId = UniqueId.create("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.USAGE_BASED, undefined, 100);

    expect(policy.props.strategy).toBe(RotationStrategy.USAGE_BASED);
    expect(policy.props.maxUses).toBe(100);
    expect(policy.props.interval).toBeUndefined();
  });

  it("should create policy with both interval and max uses", () => {
    const secretId = UniqueId.create("secret-123");

    const policy = RotationPolicy.create(secretId, RotationStrategy.TIME_BASED, 3600000, 50);

    expect(policy.props.interval).toBe(3600000);
    expect(policy.props.maxUses).toBe(50);
  });
});
