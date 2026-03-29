import { Environment } from "@application/config/environment";
import { KeyManagerService } from "@application/services/key-manager.service";
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
  ownerRoleId?: string;
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
    private readonly environment: Environment,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
  ) {}

  async execute(input: Input): Promise<Output[]> {
    const secrets = await this.secretRepository.findAll(); // Implement search by applicationId in the repository layer

    return secrets.map((secret) => {
      return {
        id: secret.id.toString(),
        name: secret.props.name,
        type: secret.props.type,
        applicationId: secret.props.applicationId.toString(),
        ownerRoleId: secret.props.createdBy,
        versions: secret.versions.map((version) => ({
          id: version.id.toString(),
          version: version.props.version,
          createdAt: version.props.createdAt,
          expiresAt: version.props.expiresAt,
        })),
      };
    });
  }
}
