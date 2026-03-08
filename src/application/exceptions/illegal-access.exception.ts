import { ApplicationException } from "./application.exception";

export default class IllegalAccessException extends ApplicationException {
  constructor(readonly message: string) {
    super(message);
  }
}
