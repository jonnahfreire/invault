import { UniqueId } from "@domain/@common/uniqueid";
import { User } from "@domain/identity/user";
import { Injectable } from "@nestjs/common";

type CreateUserInput = {
  username: string;
  email: string;
  tenantId: string;
};

@Injectable()
export default class CreateUserUseCase {
  constructor(private readonly repository: any) {}

  async execute(data: CreateUserInput): Promise<void> {
    User.create(data.username, data.email, UniqueId.create(data.tenantId));
    return new Promise(() => {});
  }
}
