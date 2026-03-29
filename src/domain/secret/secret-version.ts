import { Entity } from "../@common/entity";
import { UniqueId } from "../@common/uniqueid";

interface SecretVersionProps {
  secretId: UniqueId;
  dekId: UniqueId;
  payload: string;
  version: number;
  expiresAt?: Date;
  createdAt: Date;
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
}
