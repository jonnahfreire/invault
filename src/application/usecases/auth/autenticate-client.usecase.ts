import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import IllegalArgumentException from "../../exceptions/illegal-argument.exception";
import IUserRepository from "../../../domain/identity/user.repository";
import Argon2idEncrypter from "../../../domain/encryption/argon2id-encrypter";
import IllegalAccessException from "../../exceptions/illegal-access.exception";

interface Input {
  email: string;
  password: string;
}

interface Output {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date | undefined;
    active: boolean;
  };
}

@Injectable()
export default class AuthenticateClientUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.email) throw new IllegalArgumentException("Email is required");
    if (!input.password) throw new IllegalArgumentException("Password is required");

    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new IllegalAccessException("User or password invalid");
    if (!user.account) throw new IllegalAccessException("User has not an account");

    const passwordValid = await Argon2idEncrypter.validate(user.account.passwordHash, input.password);
    if (!passwordValid) throw new IllegalAccessException("User or password invalid");

    const payload = { sub: user.id.toString(), name: user.name, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        active: user.isActive(),
      },
    };
  }
}
