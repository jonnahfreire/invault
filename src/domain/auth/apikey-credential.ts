import { UniqueId } from "@domain/@common/uniqueid";
import { AuthCredential, AuthCredentialProps } from "./auth-credential";

interface ApiKeyCredentialProps extends AuthCredentialProps {
  apiKeyHash: string;
  expiresAt?: Date;
}

export class ApiKeyCredential extends AuthCredential<ApiKeyCredentialProps> {
  private constructor(props: ApiKeyCredentialProps, id?: UniqueId) {
    super(props, id);
  }

  public static create(props: ApiKeyCredentialProps) {
    if (!props.apiKeyHash) throw new Error("ApiKey hash is required");

    return new ApiKeyCredential({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
