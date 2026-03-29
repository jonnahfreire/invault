import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { SecretVersion } from "./secret-version";

export type SecretType = "kv" | "database" | "apikey" | "ssh" | "jwt" | "certificate";

export enum SecretStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

interface SecretProps {
  name: string;
  type: SecretType;
  applicationId: UniqueId;
  status: SecretStatus;
  versions: SecretVersion[];
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

  public static create(name: string, type: SecretType, applicationId: UniqueId, createdBy?: string) {
    return new Secret({
      name,
      type,
      applicationId,
      status: SecretStatus.ACTIVE,
      createdAt: new Date(),
      versions: [],
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

  public addVersion(version: SecretVersion) {
    if (!this.versions.some((v) => v.id === version.id)) {
      this.props.versions.push(version);
    }
  }

  get applicationId() {
    return this.props.applicationId;
  }

  get versions() {
    return this.props.versions || [];
  }
}
