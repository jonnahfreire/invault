import ArgumentConflictException from "@application/exceptions/conflict.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import IApplicationRepository from "@domain/application/application.repository";
import { ServiceAccount } from "@domain/identity/service-account";
import { IServiceAccountRepository } from "@domain/identity/service-account.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  applicationId: string;
  name: string;
  requesterId: string;
}

@Injectable()
export default class CreateServiceAccountUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly serviceAccountRepository: IServiceAccountRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<{ id: string }> {
    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), application.organizationId);
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to manage service accounts");

    const existing = await this.serviceAccountRepository.findByNameAndApplication(input.name, application.id);
    if (existing && existing.isActive()) throw new ArgumentConflictException("A service account with this name already exists");

    const serviceAccount = ServiceAccount.create(input.name, application.id);
    await this.serviceAccountRepository.save(serviceAccount);

    return { id: serviceAccount.id.toString() };
  }
}
