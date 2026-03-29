export class KeyMaterial {
  private constructor(private readonly value: string) {}

  public static fromEncrypted(value: string): KeyMaterial {
    return new KeyMaterial(value);
  }

  public get encrypted(): string {
    return this.value;
  }
}
