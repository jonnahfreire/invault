import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Secret, SecretType } from "@domain/secret/secret";
import { SecretVersion } from "@domain/secret/secret-version";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  name: string;
  type: SecretType;
  applicationId: string;
  ownerRoleId: string;
  initialData: Record<string, any>;
  actorId?: string;
}

@Injectable()
export default class CreateSecretUsecase {
  constructor(
    private readonly secretRepository: ISecretRepository,
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: Input): Promise<Secret> {
    const secret = Secret.create(input.name, input.type, UniqueId.create(input.applicationId), input.ownerRoleId);

    // await this.addSecretVersion(secret.id, input.initialData, input.actorId);

    // await this.auditService.logEvent(input.actorId, "secret.created", secret.id, this.hashData({ name: input.name, type: input.type, tenantId: input.tenantId.toString() }), undefined, {
    //   engineType: input.engineType,
    // });

    // Create initial version
    const versionNumber = 1;
    const payload = JSON.stringify(input.initialData);
    const encryptedPayload = Aes256Wrapper.wrap({ cipher: payload, dek: Buffer.from(""), kek: Buffer.from("") });

    const version = SecretVersion.create(secret.id, JSON.stringify(encryptedPayload), versionNumber, input.actorId ? UniqueId.create(input.actorId) : undefined);
    secret.addVersion(version);
    await this.secretRepository.save(secret);

    const currentHash = this.hashData(data);
    const previousVersion = existingVersions[existingVersions.length - 1];
    const previousHash = previousVersion ? this.hashData(await this.decryptVersion(previousVersion)) : undefined;

    await this.auditService.logEvent(createdBy, "secret.version.added", secretId, currentHash, previousHash, { version: versionNumber });

    return version;
    return secret;
  }
}
