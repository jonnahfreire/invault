import { Entity } from "@domain/@common/entity";
import { UniqueId } from "@domain/@common/uniqueid";

export interface AuthCredentialProps {
  identityId: UniqueId;
  createdAt?: Date;
  revokedAt?: Date;
  lastUsedAt?: Date;
}

export class AuthCredential<T extends AuthCredentialProps> extends Entity<T> {
  constructor(
    readonly props: T,
    id?: UniqueId,
  ) {
    super(props, id);
  }
}
