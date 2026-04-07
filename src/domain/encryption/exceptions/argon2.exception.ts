import { DomainException } from "@domain/@common/exceptions/domain.exception";

export class ArgonEncryptException extends DomainException {
  readonly code = "PASSWORD_ENCRYPT_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
