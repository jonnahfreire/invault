import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { ClientAccount } from "./client-account";
import { UserStatus } from "./enum/user-status.enum";
import { CreateUserException } from "./exception/user.exception";
import { Email } from "./vo/email";

interface UserProps {
  name: string;
  email: string;
  account?: ClientAccount;
  status?: UserStatus;
  createdAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  constructor(
    readonly props: UserProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(props: UserProps): User {
    if (!props.name || !props.email) throw new CreateUserException("Required fields is missing to create user");

    return new User({
      name: props.name,
      email: Email.create(props.email).toString(),
      account: props.account,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get status() {
    return this.props.status;
  }

  get account() {
    return this.props.account;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  public setAccount(account: ClientAccount) {
    this.props.account = account;
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
