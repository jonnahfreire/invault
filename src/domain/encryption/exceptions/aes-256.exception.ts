import { DomainException } from "@domain/@common/exceptions/domain.exception";

export class Aes256EncryptException extends DomainException {
  readonly code = "ENCRYPT_ERROR";
  readonly status = 400;

  constructor(message: string) {
    super(message);
  }
}

export class Aes256DecryptException extends DomainException {
  readonly code = "DECRYPT_ERROR";
  readonly status = 500;

  constructor(message: string) {
    super(message);
  }
}
