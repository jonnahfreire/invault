import { AggregateRoot } from "@domain/@common/aggregate-root";
import { UniqueId } from "@domain/@common/uniqueid";

export enum AuthSubject {
  USER = "user",
  SERVICE_ACCOUNT = "service-account",
}

export enum AuthMethodType {
  PASSWORD = "password",
  API_KEY = "api_key",
  OAUTH = "oauth",
  JWT = "jwt",
  CERTIFICATE = "certificate",
}

interface AuthenticationIdentityProps {
  subjectType: AuthSubject;
  subjectId: UniqueId;
  type: AuthMethodType;
  credentials: JSON;
  createdAt: Date;
}

export class AuthenticationIdentity extends AggregateRoot<AuthenticationIdentityProps> {
  constructor(
    readonly props: AuthenticationIdentityProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  static create(props: AuthenticationIdentityProps) {
    if (!props.credentials) throw new Error("Credentials must not be null or empty");

    return new AuthenticationIdentity(props);
  }
}
