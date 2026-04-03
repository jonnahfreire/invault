import { Entity } from "@domain/@common/entity";
import { UniqueId } from "../@common/uniqueid";
import { ClientAccountStatus } from "./enum/client-account-status.enum";

interface ClientAccountProps {
  userId: UniqueId;
  mfaEnabled: boolean;
  passwordHash: string;
  status: ClientAccountStatus;
  createdAt: Date;
}

export class ClientAccount extends Entity<ClientAccountProps> {
  constructor(
    readonly props: ClientAccountProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(userId: UniqueId, passwordHash: string, mfaEnabled: boolean) {
    return new ClientAccount({
      userId,
      mfaEnabled,
      passwordHash,
      status: ClientAccountStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  get userId() {
    return this.props.userId;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get mfaEnabled() {
    return this.props.mfaEnabled;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  public revoke() {
    this.props.status = ClientAccountStatus.REVOKED;
  }

  public isActive() {
    return this.props.status === ClientAccountStatus.ACTIVE;
  }

  public isRevoked() {
    return this.props.status === ClientAccountStatus.REVOKED;
  }

  public enableMFA() {
    this.props.mfaEnabled = true;
  }
}
