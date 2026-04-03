import { DomainException } from "@domain/@common/exceptions/domain.exception";

export class CreateUserException extends DomainException {
  readonly code = "CREATE_USER_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
