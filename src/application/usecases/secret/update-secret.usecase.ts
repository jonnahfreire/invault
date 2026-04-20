import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { SecretVersion } from "@domain/secret/secret-version";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";

interface Input {
  secretId: string;
  newData: Record<string, any>;
  updatedBy: string;
  expiresAt?: Date;
}

@Injectable()
export default class UpdateSecretUseCase {
  constructor(
    private readonly auditService: AuditService,
    private readonly secretAuthorizationService: SecretAuthorizationService,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
    private readonly dataEncryptionKeyRepository: IDataEncryptionKeyRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<void> {
    const secret = await this.secretRepository.findById(UniqueId.from(input.secretId));
    if (!secret) throw new ResourceNotFoundException("Secret not found");

    await this.secretAuthorizationService.ensureAuthorized(secret.ownerType, secret.ownerId, input.updatedBy, "write");

    const nextVersion = (secret.versions?.length ?? 0) + 1;

    const derivedKek = await this.keyManagerService.deriveKEK(KeyEncryptionKey.fromSecretType(secret.type), 1);
    const dek = this.keyManagerService.generateRandomDEK();

    const encryptedPayload = Aes256Wrapper.wrap({
      cipher: JSON.stringify(input.newData),
      dek,
      kek: derivedKek.material,
    });

    const dekMaterial = DataEncryptionKey.create(derivedKek.metadata.version, encryptedPayload.cipherDek.iv, encryptedPayload.cipherDek.tag, encryptedPayload.cipherDek.cipher);

    const version = SecretVersion.create({
      secretId: secret.id,
      dekId: dekMaterial.id,
      payload: JSON.stringify(encryptedPayload.cipherData),
      version: nextVersion,
      createdBy: UniqueId.from(input.updatedBy),
      expiresAt: input.expiresAt,
    });

    secret.setCurrentVersion(version);

    await this.dataEncryptionKeyRepository.save(dekMaterial);
    await this.secretRepository.save(secret);

    await this.auditService.logEvent(UniqueId.from(input.updatedBy), "secret.updated", secret.id, Aes256Wrapper.hashData({ name: secret.name, type: secret.type, version: nextVersion }), undefined, {
      version: secret.currentVersionId,
    });
  }
}
