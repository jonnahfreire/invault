import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Secret, SecretType } from "@domain/secret/secret";
import { SecretVersion } from "@domain/secret/secret-version";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  name: string;
  type: SecretType;
  tenantId: string;
  ownerRoleId: string;
  engineType: string;
  initialData: Record<string, any>;
  actorId: string;
}

@Injectable()
export default class CreateSecretUsecase {
  constructor(
    private readonly secretRepository: ISecretRepository,
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: Input): Promise<Secret> {
    const secret = Secret.create(input.name, input.type, input.tenantId, input.ownerRoleId, input.engineType);
    await this.secretRepository.save(secret);

    // await this.addSecretVersion(secret.id, input.initialData, input.actorId);

    // await this.auditService.logEvent(input.actorId, "secret.created", secret.id, this.hashData({ name: input.name, type: input.type, tenantId: input.tenantId.toString() }), undefined, {
    //   engineType: input.engineType,
    // });

    // Create initial version
    const versionNumber = 1;
    const payload = JSON.stringify(input.initialData);
    const encryptedPayload = EncryptionService.encrypt(payload, this.masterKey);

    const version = SecretVersion.create(secret.id, encryptedPayload, versionNumber, input.createdBy);
    await this.versionRepo.save(version);

    const currentHash = this.hashData(data);
    const previousVersion = existingVersions[existingVersions.length - 1];
    const previousHash = previousVersion ? this.hashData(await this.decryptVersion(previousVersion)) : undefined;

    await this.auditService.logEvent(createdBy, "secret.version.added", secretId, currentHash, previousHash, { version: versionNumber });

    return version;
    return secret;
  }
}
