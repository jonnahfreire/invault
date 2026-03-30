import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { SecretOwner } from "./enum/secret-owner.enum";
import { SecretStatus } from "./enum/secret-status.enum";
import { SecretVersion } from "./secret-version";
import { SecretType } from "./enum/secret-type.enum";
import CreateSecretException from "./exceptions/secret.exception";

interface SecretProps {
  name: string;
  type: SecretType;
  ownerType: SecretOwner;
  ownerId: UniqueId;
  currentVersionId?: UniqueId;
  status?: SecretStatus;
  versions?: SecretVersion[];
  currentVersion?: SecretVersion;
  createdAt?: Date;
  createdBy?: string;
}

export class Secret extends AggregateRoot<SecretProps> {
  constructor(
    readonly props: SecretProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(props: SecretProps): Secret {
    if (!props.name || !props.type || !props.ownerId || !props.ownerType) {
      throw new CreateSecretException("Missing required properties to create a Secret. Required properties: name, type, ownerId, ownerType.");
    }

    return new Secret({
      name: props.name,
      type: props.type,
      ownerId: props.ownerId,
      currentVersionId: props.currentVersionId,
      ownerType: props.ownerType || SecretOwner.SYSTEM,
      status: SecretStatus.ACTIVE,
      createdAt: new Date(),
      versions: [],
      currentVersion: props.currentVersion,
      createdBy: props.createdBy,
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

  public setCurrentVersion(version: SecretVersion) {
    this.props.currentVersionId = version.id;
    this.props.currentVersion = version;
    this.addVersion(version);
  }

  private addVersion(version: SecretVersion) {
    if (!this.props.versions) {
      this.props.versions = [];
    }

    if (!this.versions.some((v) => v.id === version.id)) {
      this.props.versions.push(version);
    }
  }

  get name() {
    return this.props.name;
  }

  get type() {
    return this.props.type;
  }

  get status() {
    return this.props.status;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get ownerType() {
    return this.props.ownerType;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get currentVersionId() {
    return this.props.currentVersionId;
  }

  get currentVersion() {
    return this.props.currentVersion;
  }

  get versions() {
    return this.props.versions || [];
  }
}
