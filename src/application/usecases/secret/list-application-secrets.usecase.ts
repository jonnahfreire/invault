import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
}

interface Output {
  id: string;
  name: string;
  type: string;
  applicationId: string;
  versions: {
    id: string;
    version: number;
    createdAt: Date;
    expiresAt?: Date;
  }[];
}

@Injectable()
export default class ListApplicationSecretsUsecase {
  constructor(private readonly secretRepository: ISecretRepository) {}

  async execute(input: Input): Promise<Output[]> {
    if (!input.applicationId) throw new IllegalArgumentException("Application ID is required to list application secrets.");

    const secrets = await this.secretRepository.findAllByOwnerId(new UniqueId(input.applicationId));

    return secrets.map((secret) => {
      return {
        id: secret.id.toString(),
        name: secret.name,
        type: secret.type,
        applicationId: secret.ownerId.toString(),
        versions: secret.versions.map((version) => ({
          id: version.id.toString(),
          version: version.version,
          createdAt: version.createdAt,
          expiresAt: version.expiresAt,
        })),
      };
    });
  }
}
