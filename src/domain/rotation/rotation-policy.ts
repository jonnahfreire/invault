import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";

export enum RotationStrategy {
  TIME_BASED = "time-based",
  USAGE_BASED = "usage-based",
}

interface RotationPolicyProps {
  secretId: UniqueId;
  strategy: RotationStrategy;
  interval?: number;
  maxUses?: number;
}

export class RotationPolicy extends AggregateRoot<RotationPolicyProps> {
  public static create(secretId: UniqueId, strategy: RotationStrategy, interval?: number, maxUses?: number) {
    return new RotationPolicy({
      secretId,
      strategy,
      interval,
      maxUses,
    });
  }

  get secretId(): UniqueId {
    return this.props.secretId;
  }

  get strategy(): RotationStrategy {
    return this.props.strategy;
  }

  get interval(): number | undefined {
    return this.props.interval;
  }

  get maxUses(): number | undefined {
    return this.props.maxUses;
  }
}
