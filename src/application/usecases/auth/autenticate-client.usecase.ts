import { Injectable } from "@nestjs/common";
import IllegalArgumentException from "../../exceptions/illegal-argument.exception";
import IUserRepository from "../../../domain/identity/user.repository";
import Argon2idEncrypter from "../../../domain/encryption/argon2id-encrypter";
import IllegalAccessException from "../../exceptions/illegal-access.exception";

interface Input {
  email: string;
  password: string;
}

@Injectable()
export default class AuthenticateClientUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async excute(input: Input): Promise<any> {
    if (!input.email) throw new IllegalArgumentException("Email is required");
    if (!input.password) throw new IllegalArgumentException("Password is required");

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new IllegalAccessException("User or password invalid");
    if (!user.account) throw new IllegalAccessException("User has not an account");

    const passwordValid = await Argon2idEncrypter.validate(user.account.passwordHash, input.password);
    if (!passwordValid) throw new IllegalAccessException("User or password invalid");

    return {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      active: user.isActive(),
    };
  }
}
