import { DomainException } from "@domain/@common/exceptions/domain.exception";

export default class CreateShamirException extends DomainException {
  readonly code = "CREATE_SHAMIR_ERROR";
  readonly status = 422;

  constructor(message: string) {
    super(message);
  }
}
