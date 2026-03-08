import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";

interface KeyRotationPolicyProps {
  keyRingId: UniqueId;
  intervalDays: number;
  autoRotate: boolean;
  createdAt: Date;
}

export class KeyRotationPolicy extends AggregateRoot<KeyRotationPolicyProps> {
  public static create(keyRingId: UniqueId, intervalDays: number, autoRotate = true): KeyRotationPolicy {
    if (intervalDays < 1) {
      throw new Error("Rotation interval must be at least 1 day.");
    }

    return new KeyRotationPolicy({
      keyRingId,
      intervalDays,
      autoRotate,
      createdAt: new Date(),
    });
  }
}
