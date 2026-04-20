import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";

interface Input {
  applicationId: string;
  requesterId: string;
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
  constructor(
    private readonly secretRepository: ISecretRepository,
    private readonly secretAuthorizationService: SecretAuthorizationService,
  ) {}

  async execute(input: Input): Promise<Output[]> {
    if (!input.applicationId) throw new IllegalArgumentException("Application ID is required to list application secrets.");

    await this.secretAuthorizationService.ensureAuthorized(SecretOwner.APPLICATION, UniqueId.from(input.applicationId), input.requesterId, "read");

    const secrets = await this.secretRepository.findAllByOwnerId(UniqueId.from(input.applicationId));

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
