import ArgumentConflictException from "@application/exceptions/conflict.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import IApplicationRepository from "@domain/application/application.repository";
import { Application } from "@domain/application/application";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  name: string;
  organizationId: string;
  requesterId: string;
}

@Injectable()
export default class CreateApplicationUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<{ id: string }> {
    const org = await this.organizationRepository.findById(UniqueId.from(input.organizationId));
    if (!org) throw new ResourceNotFoundException("Organization not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), UniqueId.from(input.organizationId));
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to create applications");

    const existing = await this.applicationRepository.findAllByOrganizationId(UniqueId.from(input.organizationId));
    const nameConflict = existing.some((a) => a.props.name === input.name);
    if (nameConflict) throw new ArgumentConflictException("An application with this name already exists");

    const application = Application.create(input.name, UniqueId.from(input.organizationId));
    await this.applicationRepository.save(application);

    return { id: application.id.toString() };
  }
}
