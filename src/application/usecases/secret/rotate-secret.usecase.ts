import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { Injectable } from "@nestjs/common";
import GetSecretVersionUseCase from "./get-secret-version.usecase";
import UpdateSecretUseCase from "./update-secret.usecase";

interface Input {
  secretId: string;
  actorId: string;
  expiresAt?: Date;
}

@Injectable()
export default class RotateSecretUseCase {
  constructor(
    private readonly getSecretVersionUseCase: GetSecretVersionUseCase,
    private readonly updateSecretUseCase: UpdateSecretUseCase,
  ) {}

  async execute(input: Input): Promise<void> {
    const currentData = await this.getSecretVersionUseCase.execute({
      secretId: input.secretId,
      actorId: input.actorId,
    });

    if (typeof currentData !== "object" || currentData === null || Array.isArray(currentData)) {
      throw new IllegalArgumentException("Only object-based secret payloads are supported for rotation");
    }

    await this.updateSecretUseCase.execute({
      secretId: input.secretId,
      newData: currentData,
      updatedBy: input.actorId,
      expiresAt: input.expiresAt,
    });
  }
}
