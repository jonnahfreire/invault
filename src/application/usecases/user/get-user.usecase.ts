import { Injectable } from "@nestjs/common";
import ArgumentNullException from "src/application/exceptions/argument-null.exception";
import ResourceNotFoundException from "src/application/exceptions/resource-not-found.exception";
import User from "src/domain/user/entities/user";
import IUserRepository from "src/domain/user/user-repository";

@Injectable()
export default class GetUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: number): Promise<User | null> {
    if (!id) throw new ArgumentNullException("Id do usuário é obrigatório");

    const user = await this.repository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException("Usuário não encontrado");
    }

    return user;
  }
}
