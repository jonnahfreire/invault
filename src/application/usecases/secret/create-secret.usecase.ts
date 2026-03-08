import { Secret, SecretType } from "@domain/secret/secret";
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
  constructor(private readonly secretRepository: ISecretRepository) {}

  async execute(input: Input): Promise<Secret> {
    const secret = Secret.create(input.name, input.type, input.tenantId, input.ownerRoleId, input.engineType);
    await this.secretRepository.save(secret);

    // Create initial version
    await this.addSecretVersion(secret.id, input.initialData, input.actorId);

    await this.auditService.logEvent(input.actorId, "secret.created", secret.id, this.hashData({ name: input.name, type: input.type, tenantId: input.tenantId.toString() }), undefined, {
      engineType: input.engineType,
    });

    // const secret = await this.secretRepository.findById(secretId);
    if (!secret || !secret.isActive()) {
      throw new Error("Secret not found or inactive");
    }

    const existingVersions = await this.versionRepo.findBySecretId(secretId.toString());
    const versionNumber = existingVersions.length + 1;

    const payload = JSON.stringify(data);
    const encryptedPayload = EncryptionService.encrypt(payload, this.masterKey);

    const version = SecretVersion.create(secretId, encryptedPayload, versionNumber, createdBy);
    await this.versionRepo.save(version);

    const currentHash = this.hashData(data);
    const previousVersion = existingVersions[existingVersions.length - 1];
    const previousHash = previousVersion ? this.hashData(await this.decryptVersion(previousVersion)) : undefined;

    await this.auditService.logEvent(createdBy, "secret.version.added", secretId, currentHash, previousHash, { version: versionNumber });

    return version;
    return secret;
  }
}
