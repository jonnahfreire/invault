export class Scope {
  constructor(readonly pattern: string) {}

  matches(resource: string): boolean {
    // if (this.pattern === "*") return true;
    // const regex = this.pattern.replace(/\./g, "\\.").replace(/\*/g, ".*");
    // return new RegExp(`^${regex}$`).test(resource);

    const scopeParts = this.pattern.split("/");
    const resourceParts = resource.split("/");

    for (let i = 0; i < scopeParts.length; i++) {
      if (scopeParts[i] === "*") {
        return true;
      }

      if (scopeParts[i] !== resourceParts[i]) {
        return false;
      }
    }

    return true;
  }

  public get value(): string {
    return this.pattern;
  }
}
