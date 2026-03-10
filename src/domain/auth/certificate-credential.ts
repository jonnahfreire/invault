import { UniqueId } from "@domain/@common/uniqueid";
import { AuthCredential, AuthCredentialProps } from "./auth-credential";

interface CertificateCredentialProps extends AuthCredentialProps {
  fingerprint: string;
  subject: string;
  expiresAt?: Date;
}

export class CertificateCredential extends AuthCredential<CertificateCredentialProps> {
  private constructor(props: CertificateCredentialProps, id?: UniqueId) {
    super(props, id);
  }

  public static create(props: CertificateCredentialProps) {
    if (!props.fingerprint) throw new Error("Certificate fingerprint required");

    return new CertificateCredential({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
