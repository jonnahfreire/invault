import IllegalAccessException from "@application/exceptions/illegal-access.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IApplicationRepository from "@domain/application/application.repository";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
  authenticatedApplicationId: string;
}

interface Output {
  id: string;
  name: string;
  type: string;
  status?: string;
  currentVersionId?: string;
  createdAt?: Date;
}

@Injectable()
export default class ListApplicationSecretsByApiKeyUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly secretRepository: ISecretRepository,
  ) {}

  async execute(input: Input): Promise<Output[]> {
    if (input.applicationId !== input.authenticatedApplicationId) {
      throw new IllegalAccessException("Unauthorized: API key cannot access another application");
    }

    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const secrets = await this.secretRepository.findAllByOwnerId(application.id);
    return secrets.map((secret) => ({
      id: secret.id.toString(),
      name: secret.name,
      type: secret.type,
      status: secret.status,
      currentVersionId: secret.currentVersionId?.toString(),
      createdAt: secret.createdAt,
    }));
  }
}
