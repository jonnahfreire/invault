import { ApplicationException } from "./application.exception";

export default class ArgumentConflictException extends ApplicationException {
  constructor(readonly message: string) {
    super(message);
  }
}
