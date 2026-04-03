import { DomainException } from "@domain/@common/exceptions/domain.exception";

export default class CreateOrganizationException extends DomainException {
  readonly code = "CREATE_ORGANIZATION_ERROR";
  readonly status = 422;

  constructor(message: string) {
    super(message);
  }
}
