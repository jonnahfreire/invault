import ArgumentConflictException from "@application/exceptions/conflict.exception";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { Secret } from "@domain/secret/secret";
import { SecretVersion } from "@domain/secret/secret-version";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  name: string;
  type: SecretType;
  ownerType: SecretOwner;
  ownerId: string;
  initialData: Record<string, any>;
  createdBy?: string;
  expiresAt?: Date;
}

@Injectable()
export default class CreateSecretUsecase {
  constructor(
    private readonly auditService: AuditService,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
    private readonly dataEncryptionKeyRepository: IDataEncryptionKeyRepository,
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(input: Input): Promise<void> {
    const existingSecret = await this.secretRepository.findByName(input.name);
    if (existingSecret) throw new ArgumentConflictException("Secret with this name already exists");

    await this.uow.run<void>(async (transaction) => {
      const secret = Secret.create({
        name: input.name,
        type: input.type,
        ownerId: UniqueId.create(input.ownerId),
        ownerType: input.ownerType,
        createdBy: input.createdBy,
      });

      const derivedKek = await this.keyManagerService.deriveKEK(KeyEncryptionKey.fromSecretType(input.type), 1 /* Starting with KEK version 1 */);
      const dek = this.keyManagerService.generateRandomDEK();

      const encryptedPayload = Aes256Wrapper.wrap({ cipher: JSON.stringify(input.initialData), dek, kek: derivedKek.material });
      const dekMaterial = DataEncryptionKey.create(derivedKek.metadata.version, encryptedPayload.cipherDek.iv, encryptedPayload.cipherDek.tag, encryptedPayload.cipherDek.cipher);

      // Create initial version
      const version = SecretVersion.create({
        secretId: secret.id,
        dekId: dekMaterial.id,
        payload: JSON.stringify(encryptedPayload.cipherData),
        version: 1,
        createdBy: input.createdBy ? UniqueId.create(input.createdBy) : undefined,
        expiresAt: input.expiresAt,
      });

      secret.setCurrentVersion(version);
      await this.dataEncryptionKeyRepository.save(dekMaterial, transaction);
      await this.secretRepository.save(secret, transaction);

      await this.auditService.logEvent(
        UniqueId.create(input.createdBy),
        "secret.created",
        secret.id,
        Aes256Wrapper.hashData({ name: input.name, type: input.type, ownerId: input.ownerId, ownerType: input.ownerType }),
        undefined,
        {
          version: secret.currentVersionId,
        },
      );
    });
  }
}
