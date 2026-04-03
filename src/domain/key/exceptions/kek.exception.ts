import { DomainException } from "@domain/@common/exceptions/domain.exception";

export default class CreateKekException extends DomainException {
  readonly code = "CREATE_KEK_ERROR";
  readonly status = 422;

  constructor(message: string) {
    super(message);
  }
}
