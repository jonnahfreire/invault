import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { SecretVersion } from "./secret-version";

export type SecretType = "kv" | "database" | "apikey" | "ssh" | "certificate";

export enum SecretStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

interface SecretProps {
  name: string;
  type: SecretType;
  tenantId: string;
  ownerRoleId: string;
  engineType: string;
  status: SecretStatus;
  versions?: SecretVersion[];
  createdAt: Date;
  createdBy?: string;
}

export class Secret extends AggregateRoot<SecretProps> {
  constructor(
    readonly props: SecretProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, type: SecretType, tenantId: string, ownerRoleId: string, engineType: string, createdBy?: string) {
    return new Secret({
      name,
      type,
      tenantId,
      ownerRoleId,
      engineType,
      status: SecretStatus.ACTIVE,
      createdAt: new Date(),
      createdBy,
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

  get secretVersions() {
    return this.props.versions || [];
  }
}
