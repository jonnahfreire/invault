export default class EnvironmentException extends Error {
  name: string = this.constructor.name;

  constructor(
    readonly message: string,
    readonly suggestion?: unknown,
    readonly stack?: string | undefined,
  ) {
    super(message);
  }
}
