export class UniqueId {
  constructor(private readonly value: string) {}

  public static create(value?: string): UniqueId {
    return new UniqueId(value ?? crypto.randomUUID());
  }

  public toString(): string {
    return this.value;
  }

  public equals(id: UniqueId): boolean {
    return this.value === id.value;
  }
}
