import { Environment } from "@application/config/environment";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { Secret } from "@domain/secret/secret";
import { SecretVersion } from "@domain/secret/secret-version";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import crypto from "node:crypto";

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
    private readonly environment: Environment,
    private readonly auditService: AuditService,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const secret = Secret.create({
      name: input.name,
      type: input.type,
      ownerId: UniqueId.create(input.ownerId),
      ownerType: input.ownerType,
      createdBy: input.createdBy,
    });

    const derivedKek = await this.keyManagerService.deriveKEK(KeyEncryptionKey.fromSecretType(input.type));
    const dek = this.keyManagerService.generateRandomDEK();

    const payload = JSON.stringify(input.initialData);
    const encryptedPayload = Aes256Wrapper.wrap({ cipher: payload, dek, kek: derivedKek.material });
    const dekMaterial = DataEncryptionKey.create(derivedKek.metadata.id, encryptedPayload.cipherDek.iv, encryptedPayload.cipherDek.tag, encryptedPayload.cipherDek.cipher);

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
    //TODO: Save DEK material
    // ...
    // TODO: Save KEK metadata if not already saved (can be optimized by caching KEKs in memory with expiration)

    await this.secretRepository.save(secret);
    await this.auditService.logEvent(
      UniqueId.create(input.createdBy),
      "secret.created",
      secret.id,
      this.hashData({ name: input.name, type: input.type, ownerId: input.ownerId, ownerType: input.ownerType }),
      undefined,
      {
        version: version.version,
      },
    );
  }

  private hashData(data: any): string {
    return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  }
}
