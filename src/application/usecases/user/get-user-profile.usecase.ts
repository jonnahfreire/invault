import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IUserRepository from "@domain/identity/user.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  userId: string;
}

@Injectable()
export default class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: Input) {
    const user = await this.userRepository.findById(UniqueId.from(input.userId));
    if (!user) throw new ResourceNotFoundException("User not found");

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      active: user.isActive(),
      createdAt: user.createdAt,
    };
  }
}
