import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256EncryptedData } from "@domain/encryption/aes-256-gcm-encrypter";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";

interface Input {
  secretId: string;
  actorId: string;
}

@Injectable()
export default class GetSecretVersionUseCase {
  constructor(
    private readonly auditService: AuditService,
    private readonly secretAuthorizationService: SecretAuthorizationService,
    private readonly keyManagerService: KeyManagerService,
    private readonly secretRepository: ISecretRepository,
    private readonly dataEncryptionKeyRepository: IDataEncryptionKeyRepository,
  ) {}

  async execute({ secretId, actorId }: Input): Promise<string | number | boolean | Record<string, any>> {
    if (!secretId) throw new IllegalArgumentException("Secret ID is required");

    const secret = await this.secretRepository.findById(UniqueId.from(secretId));
    if (!secret) throw new ResourceNotFoundException("Secret not found");

    await this.secretAuthorizationService.ensureAuthorized(secret.ownerType, secret.ownerId, actorId, "read");

    const currentVersion = secret.currentVersion;
    if (!currentVersion) throw new ResourceNotFoundException("Secret version not found");

    const dekMaterial = await this.dataEncryptionKeyRepository.findById(currentVersion.dekId);
    if (!dekMaterial) throw new ResourceNotFoundException("Data Encryption Key not found");

    const derivedKek = await this.keyManagerService.deriveKEK(KeyEncryptionKey.fromSecretType(secret.type), dekMaterial.kekVersion);
    const data = JSON.parse(currentVersion.payload) as Aes256EncryptedData;
    const decryptedData = Aes256Wrapper.unwrap({
      data,
      dek: {
        cipher: dekMaterial.cipher,
        iv: dekMaterial.iv,
        tag: dekMaterial.tag,
        key: derivedKek.material.toString("hex"),
      },
    });

    await this.auditService.logEvent(
      UniqueId.create(actorId),
      "secret.retrieved",
      secret.id,
      Aes256Wrapper.hashData({ name: secret.name, type: secret.type, ownerId: secret.ownerId, ownerType: secret.ownerType }),
      undefined,
      { version: secret.currentVersionId },
    );

    return decryptedData;
  }
}
