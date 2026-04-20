import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  organizationId: string;
  targetUserId: string;
  requesterId: string;
}

@Injectable()
export default class RemoveMemberUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<void> {
    const org = await this.organizationRepository.findById(UniqueId.from(input.organizationId));
    if (!org) throw new ResourceNotFoundException("Organization not found");

    const requesterMembership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), UniqueId.from(input.organizationId));
    if (!requesterMembership) throw new ResourceNotFoundException("Requester is not a member of this organization");

    const isOwnerOrAdmin = requesterMembership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to remove members");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.targetUserId), UniqueId.from(input.organizationId));
    if (!membership) throw new ResourceNotFoundException("User is not a member of this organization");

    await this.membershipRepository.delete(membership.id);
  }
}
