import { DomainException } from "@domain/@common/exceptions/domain.exception";

export class InitializeVaultException extends DomainException {
  readonly code = "INITIALIZE_VAULT_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}

export class VaultException extends DomainException {
  readonly code = "VAULT_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}
