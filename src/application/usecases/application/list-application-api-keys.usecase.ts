import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import IApplicationRepository from "@domain/application/application.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
  requesterId: string;
}

@Injectable()
export default class ListApplicationApiKeysUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly apiKeyRepository: IApiKeyRepository,
  ) {}

  async execute(input: Input): Promise<Array<{ id: string; name: string; active: boolean; createdAt: Date; expiresAt?: Date }>> {
    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), application.organizationId);
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const keys = await this.apiKeyRepository.findByApplicationId(application.id);
    return keys.map((key) => ({
      id: key.id.toString(),
      name: key.name,
      active: key.isValid(),
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
    }));
  }
}
