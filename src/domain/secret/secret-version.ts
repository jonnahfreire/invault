import { Entity } from "../@common/entity";
import { UniqueId } from "../@common/uniqueid";

interface SecretVersionProps {
  secretId: UniqueId;
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

  public static create(secretId: UniqueId, payload: string, version: number, createdBy?: UniqueId, expiresAt?: Date) {
    return new SecretVersion({
      secretId,
      payload,
      version,
      createdAt: new Date(),
      createdBy,
      expiresAt,
    });
  }
}
