import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { AuditService } from "@application/services/audit.service";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";

interface Input {
  secretId: string;
  actorId: string;
}

@Injectable()
export default class RevokeSecretUseCase {
  constructor(
    private readonly auditService: AuditService,
    private readonly secretAuthorizationService: SecretAuthorizationService,
    private readonly secretRepository: ISecretRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<void> {
    if (!input.secretId) throw new IllegalArgumentException("Secret ID is required");

    const secret = await this.secretRepository.findById(UniqueId.from(input.secretId));
    if (!secret) throw new ResourceNotFoundException("Secret not found");

    await this.secretAuthorizationService.ensureAuthorized(secret.ownerType, secret.ownerId, input.actorId, "write");

    if (secret.isRevoked()) throw new IllegalArgumentException("Secret is already revoked");

    secret.revoke();
    await this.secretRepository.save(secret);

    await this.auditService.logEvent(
      UniqueId.from(input.actorId),
      "secret.revoked",
      secret.id,
      Aes256Wrapper.hashData({ name: secret.name, type: secret.type, ownerId: secret.ownerId, ownerType: secret.ownerType }),
      undefined,
      { secretId: input.secretId },
    );
  }
}
