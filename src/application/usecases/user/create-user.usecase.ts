import { UniqueId } from "@domain/@common/uniqueid";
import { User } from "@domain/identity/user";
import { Injectable } from "@nestjs/common";

type CreateUserInput = {
  username: string;
  email: string,
  tenantId: string,
};

@Injectable()
export default class CreateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(data: CreateUserInput): Promise<void> {
    const user = User.create({ ...data, tenantId: UniqueId.create(data.tenantId)});
    await this.repository.create(user);
  }
}
