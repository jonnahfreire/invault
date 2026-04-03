import { InvalidEmailException } from "../exception/email.exception";

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    if (!email) {
      throw new InvalidEmailException("Email is required");
    }

    const normalized = email.trim();

    if (!Email.isValid(normalized)) {
      throw new InvalidEmailException("Invalid email format");
    }

    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    return regex.test(email);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
