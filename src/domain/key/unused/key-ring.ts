import { AggregateRoot } from "../../@common/aggregate-root";
import { UniqueId } from "../../@common/uniqueid";

interface KeyRingProps {
  tenantId: UniqueId;
  name: string;
  createdAt: Date;
}

export class KeyRing extends AggregateRoot<KeyRingProps> {
  private constructor(
    readonly props: KeyRingProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, tenantId: UniqueId): KeyRing {
    return new KeyRing({
      name,
      tenantId: tenantId,
      createdAt: new Date(),
    });
  }

  public get tenantId() {
    return this.props.tenantId;
  }
}
