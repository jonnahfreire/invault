import { ApplicationException } from "./application.exception";

export default class ArgumentNullException extends ApplicationException {
  constructor(readonly message: string) {
    super(message);
  }
}
