export class UniqueId {
  private constructor(
    private readonly value: string,
    private readonly isNew: boolean = true,
  ) {}

  /**
   * Gera um novo UniqueId
   *
   * @public
   * @static
   * @param {?string} [value]
   * @returns {UniqueId}
   */
  public static create(value?: string): UniqueId {
    return new UniqueId(value ?? crypto.randomUUID(), true);
  }

  /**
   * Retorna um UniqueId a partir de um valor existente
   *
   * @public
   * @static
   * @param {string} value
   * @returns {UniqueId}
   */
  public static from(value: string): UniqueId {
    return new UniqueId(value, false);
  }

  public toString(): string {
    return this.value;
  }

  public isDirty() {
    return this.isNew;
  }

  public equals(id: UniqueId): boolean {
    return this.value === id.value;
  }
}
