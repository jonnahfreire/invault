import { ClientAccount } from "@domain/identity/client-account";
import { User } from "@domain/identity/user";
import { Injectable } from "@nestjs/common";
import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import Argon2idEncrypter from "@domain/encryption/argon2id-encrypter";
import IUserRepository from "@domain/identity/user.repository";
import ArgumentConflictException from "@application/exceptions/conflict.exception";

type Input = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export default class CreateUserAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(input: Input): Promise<void> {
    if (!input.email) throw new IllegalArgumentException("User email is required");
    if (!input.name) throw new IllegalArgumentException("User name is required");
    if (!input.password) throw new IllegalArgumentException("User password is required");

    await this.uow.run<void>(async (transaction) => {
      const existingByEmail = await this.userRepository.findByEmail(input.email, transaction);
      if (existingByEmail) throw new ArgumentConflictException("Email is already in use");

      const user = User.create({ name: input.name, email: input.email });
      const password = await Argon2idEncrypter.create(input.password);
      const account = ClientAccount.create(user.id, password, false);
      user.setAccount(account);

      await this.userRepository.save(user, transaction);
    });
  }
}
