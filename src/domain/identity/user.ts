import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  REVOKED = "revoked",
}

interface UserProps {
  name: string;
  email: string;
  mfaEnabled: boolean;
  status: UserStatus;
  createdAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  constructor(
    readonly props: UserProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(username: string, email: string): User {
    return new User({
      name: username,
      email,
      mfaEnabled: false,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  public enableMFA() {
    this.props.mfaEnabled = true;
  }

  public suspend() {
    this.props.status = UserStatus.SUSPENDED;
  }

  public revoke() {
    this.props.status = UserStatus.REVOKED;
  }

  public isActive() {
    return this.props.status === UserStatus.ACTIVE;
  }

  public isSuspended() {
    return this.props.status === UserStatus.SUSPENDED;
  }

  public isRevoked() {
    return this.props.status === UserStatus.REVOKED;
  }
}
