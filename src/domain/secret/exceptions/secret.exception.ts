import { DomainException } from "@domain/@common/exceptions/domain.exception";

export default class CreateSecretException extends DomainException {
  readonly code = "CREATE_SECRET_ERROR";
  readonly status = 422;

  constructor(message: string) {
    super(message);
  }
}
