import { Environment } from "@application/config/environment";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
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
  expiresAt?: Date;
}

@Injectable()
export default class CreateSecretUsecase {
  constructor(
    private readonly environment: Environment,
    private readonly auditService: AuditService,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const secret = Secret.create(input.name, input.type, UniqueId.create(input.applicationId), input.ownerRoleId);

    // await this.addSecretVersion(secret.id, input.initialData, input.actorId);

    // await this.auditService.logEvent(input.actorId, "secret.created", secret.id, this.hashData({ name: input.name, type: input.type, tenantId: input.tenantId.toString() }), undefined, {
    //   engineType: input.engineType,
    // });

    const kekMetadata = KeyEncryptionKey.create(KeyEncryptionKey.fromSecretType(input.type), this.environment.nodeEnv);
    const kek = await this.keyManagerService.deriveKEK(kekMetadata);
    const dek = this.keyManagerService.generateRandomDEK();

    const payload = JSON.stringify(input.initialData);
    const encryptedPayload = Aes256Wrapper.wrap({ cipher: payload, dek, kek });
    const dekMaterial = DataEncryptionKey.create(kekMetadata.id, encryptedPayload.cipherDek.iv, encryptedPayload.cipherDek.tag, encryptedPayload.cipherDek.cipher);

    // Create initial version
    const version = SecretVersion.create({
      secretId: secret.id,
      dekId: dekMaterial.id,
      payload: JSON.stringify(encryptedPayload.cipherData),
      version: 1,
      createdBy: input.actorId ? UniqueId.create(input.actorId) : undefined,
      expiresAt: input.expiresAt,
    });

    secret.addVersion(version);
    await this.secretRepository.save(secret);

    // const currentHash = this.hashData(data);
    // const previousVersion = existingVersions[existingVersions.length - 1];
    // const previousHash = previousVersion ? this.hashData(await this.decryptVersion(previousVersion)) : undefined;

    // await this.auditService.logEvent(createdBy, "secret.version.added", secretId, currentHash, previousHash, { version: versionNumber });
  }
}
