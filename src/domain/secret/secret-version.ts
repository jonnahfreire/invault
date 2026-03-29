import { Entity } from "../@common/entity";
import { UniqueId } from "../@common/uniqueid";
import CreateSecretVersionException from "./exceptions/secret-version.exception";

interface SecretVersionProps {
  secretId: UniqueId;
  dekId: UniqueId;
  payload: string;
  version: number;
  createdAt: Date;
  expiresAt?: Date;
  createdBy?: UniqueId;
}

export class SecretVersion extends Entity<SecretVersionProps> {
  constructor(
    readonly props: SecretVersionProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(props: Omit<SecretVersionProps, "createdAt">): SecretVersion {
    if (!props.secretId || !props.dekId || !props.payload || !props.version) {
      throw new CreateSecretVersionException("Missing required properties to create a SecretVersion. Required properties: secretId, dekId, payload, version.");
    }

    if (props.expiresAt && new Date(props.expiresAt).getTime() <= new Date().getTime()) {
      throw new CreateSecretVersionException("Expiration date must be in the future.");
    }

    return new SecretVersion({
      secretId: props.secretId,
      dekId: props.dekId,
      payload: props.payload,
      version: props.version,
      createdAt: new Date(),
      createdBy: props.createdBy,
      expiresAt: props.expiresAt,
    });
  }

  get secretId() {
    return this.props.secretId;
  }

  get dekId() {
    return this.props.dekId;
  }

  get payload() {
    return this.props.payload;
  }

  get version() {
    return this.props.version;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }
}
