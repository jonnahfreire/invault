import { Injectable } from "@nestjs/common";
import ArgumentNullException from "src/application/exceptions/argument-null.exception";
import ResourceNotFoundException from "src/application/exceptions/resource-not-found.exception";

@Injectable()
export default class GetUserUseCase {
  constructor(private readonly repository: any) {}

  async execute(id: number): Promise<any> {
    if (!id) throw new ArgumentNullException("Id do usuário é obrigatório");

    const user = null;
    if (!user) {
      throw new ResourceNotFoundException("Usuário não encontrado");
    }

    return new Promise(() => user);
  }
}
