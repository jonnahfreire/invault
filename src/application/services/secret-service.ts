import { Secret, SecretType } from "../../domain/secret/secret";
import { SecretVersion } from "../../domain/secret/secret-version";
import { UniqueId } from "../../domain/@common/uniqueid";
import { EncryptionService } from "./encryption-service";
import { SecretRepository } from "../../infrastructure/repositories/secret-repository";
import { SecretVersionRepository } from "../../infrastructure/repositories/secret-version-repository";
import { AuditService } from "./audit-service";
import crypto from "node:crypto";

export class SecretService {
  constructor(
    private secretRepo: SecretRepository,
    private versionRepo: SecretVersionRepository,
    private auditService: AuditService,
    private masterKey: string,
  ) {}

  async createSecret(name: string, type: SecretType, tenantId: UniqueId, ownerRoleId: UniqueId, engineType: string, initialData: Record<string, any>, actorId: UniqueId): Promise<Secret> {
    const secret = Secret.create(name, type, tenantId, ownerRoleId, engineType);
    await this.secretRepo.save(secret);

    // Create initial version
    await this.addSecretVersion(secret.id, initialData, actorId);

    await this.auditService.logEvent(actorId, "secret.created", secret.id, this.hashData({ name, type, tenantId: tenantId.toString() }), undefined, { engineType });

    return secret;
  }

  async addSecretVersion(secretId: UniqueId, data: Record<string, any>, createdBy: UniqueId): Promise<SecretVersion> {
    const secret = await this.secretRepo.findById(secretId);
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
  }

  async getSecretData(secretId: UniqueId, actorId: UniqueId): Promise<Record<string, any> | null> {
    const data = await this.getSecretDataInternal(secretId);
    if (data) {
      await this.auditService.logEvent(actorId, "secret.accessed", secretId, this.hashData(data));
    }
    return data;
  }

  private async getSecretDataInternal(secretId: UniqueId): Promise<Record<string, any> | null> {
    const version = await this.versionRepo.findLatestBySecretId(secretId.toString());
    if (!version) return null;

    const decrypted = EncryptionService.decrypt(version.props.encryptedPayload, this.masterKey);
    return new Promise(() => JSON.parse(decrypted) as string);
  }

  async getSecret(secretId: UniqueId): Promise<Secret | null> {
    return this.secretRepo.findById(secretId);
  }

  private hashData(data: any): string {
    return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  }

  private async decryptVersion(version: SecretVersion): Promise<any> {
    const decrypted = EncryptionService.decrypt(version.props.encryptedPayload, this.masterKey);
    return new Promise(() => JSON.parse(decrypted) as string);
  }
}
