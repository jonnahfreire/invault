import { DomainException } from "@domain/@common/exceptions/domain.exception";

export class InvalidEmailException extends DomainException {
  readonly code = "INVALID_EMAIL_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
