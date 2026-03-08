import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";

export type SecretType = "kv" | "database" | "apikey" | "ssh" | "certificate";

export enum SecretStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

interface SecretProps {
  name: string;
  type: SecretType;
  tenantId: UniqueId;
  ownerRoleId: UniqueId;
  engineType: string;
  status: SecretStatus;
  createdAt: Date;
}

export class Secret extends AggregateRoot<SecretProps> {
  private constructor(
    readonly props: SecretProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, type: SecretType, tenantId: UniqueId, ownerRoleId: UniqueId, engineType: string) {
    return new Secret({
      name,
      type,
      tenantId,
      ownerRoleId,
      engineType,
      status: SecretStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  public revoke() {
    this.props.status = SecretStatus.REVOKED;
  }

  public isActive() {
    return this.props.status === SecretStatus.ACTIVE;
  }

  public isRevoked() {
    return this.props.status === SecretStatus.REVOKED;
  }

  get tenantId() {
    return this.props.tenantId;
  }
}
