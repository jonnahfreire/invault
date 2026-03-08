import { ApplicationException } from "./application.exception";

export default class IllegalArgumentException extends ApplicationException {
  constructor(readonly message: string) {
    super(message);
  }
}
