import { Injectable } from "@nestjs/common";
import User from "src/domain/user/entities/user";
import IUserRepository from "src/domain/user/user-repository";

@Injectable()
export default class GetAllUsersUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(organizationId: number): Promise<User[]> {
    const users = await this.repository.findAllByOrganizationId(organizationId);

    return users;
  }
}
