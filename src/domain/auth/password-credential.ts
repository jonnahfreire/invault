import { UniqueId } from "@domain/@common/uniqueid";
import { AuthCredential, AuthCredentialProps } from "./auth-credential";

interface PasswordCredentialProps extends AuthCredentialProps {
  passwordHash: string;
}

export class PasswordCredential extends AuthCredential<PasswordCredentialProps> {
  constructor(
    readonly props: PasswordCredentialProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  static create(props: PasswordCredentialProps) {
    if (!props.passwordHash) throw new Error("Password hash is required");

    return new PasswordCredential({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
