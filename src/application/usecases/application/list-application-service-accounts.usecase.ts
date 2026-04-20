import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IApplicationRepository from "@domain/application/application.repository";
import { IServiceAccountRepository } from "@domain/identity/service-account.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
  requesterId: string;
}

@Injectable()
export default class ListApplicationServiceAccountsUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly serviceAccountRepository: IServiceAccountRepository,
  ) {}

  async execute(input: Input): Promise<Array<{ id: string; name: string; active: boolean; createdAt: Date }>> {
    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), application.organizationId);
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const accounts = await this.serviceAccountRepository.findByApplicationId(application.id);
    return accounts.map((account) => ({
      id: account.id.toString(),
      name: account.props.name,
      active: account.isActive(),
      createdAt: account.props.createdAt,
    }));
  }
}
