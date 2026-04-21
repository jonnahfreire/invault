import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { AuditService } from "@application/services/audit.service";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import IApplicationRepository from "@domain/application/application.repository";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
  apiKeyId: string;
  requesterId: string;
}

@Injectable()
export default class RevokeApiKeyUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly apiKeyRepository: IApiKeyRepository,
    private readonly auditService: AuditService,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<void> {
    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), application.organizationId);
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to revoke API keys");

    const apiKey = await this.apiKeyRepository.findById(UniqueId.from(input.apiKeyId));
    if (!apiKey) throw new ResourceNotFoundException("API key not found");

    if (apiKey.applicationId.toString() !== application.id.toString()) {
      throw new IllegalArgumentException("API key does not belong to application");
    }

    if (!apiKey.active) return;

    apiKey.revoke();
    await this.apiKeyRepository.save(apiKey);

    await this.auditService.logEvent(
      UniqueId.create(input.requesterId),
      "api_key.revoked",
      application.id,
      Aes256Wrapper.hashData({
        apiKeyId: apiKey.id.toString(),
        applicationId: application.id.toString(),
        name: apiKey.name,
      }),
      undefined,
      {
        apiKeyId: apiKey.id.toString(),
        applicationId: application.id.toString(),
      },
    );
  }
}
