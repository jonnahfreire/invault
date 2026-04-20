import { Entity } from "@domain/@common/entity";
import { UniqueId } from "@domain/@common/uniqueid";

interface ApiKeyProps {
  applicationId: UniqueId;
  name: string;
  keyHash: string;
  active: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export class ApiKey extends Entity<ApiKeyProps> {
  constructor(
    readonly props: ApiKeyProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, applicationId: UniqueId, keyHash: string, expiresAt?: Date): ApiKey {
    return new ApiKey({
      name,
      applicationId,
      keyHash,
      active: true,
      createdAt: new Date(),
      expiresAt,
    });
  }

  get applicationId() {
    return this.props.applicationId;
  }

  get name() {
    return this.props.name;
  }

  get keyHash() {
    return this.props.keyHash;
  }

  get active() {
    return this.props.active;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  public revoke() {
    this.props.active = false;
  }

  public isExpired(): boolean {
    return !!this.props.expiresAt && new Date() > this.props.expiresAt;
  }

  public isValid(): boolean {
    return this.props.active && !this.isExpired();
  }
}
