import { ApplicationException } from "./application.exception";

export default class ResourceNotFoundException extends ApplicationException {
  constructor(readonly message: string) {
    super(message);
  }
}
