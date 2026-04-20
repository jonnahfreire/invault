import ArgumentConflictException from "@application/exceptions/conflict.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import IUserRepository from "@domain/identity/user.repository";
import { Membership } from "@domain/organization/membership";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Action, Permission, ResourceType } from "@domain/permission/permission";
import { Role } from "@domain/permission/role";
import { Injectable } from "@nestjs/common";

interface Input {
  organizationId: string;
  targetUserId: string;
  requesterId: string;
}

@Injectable()
export default class AddMemberUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
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
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to add members");

    const existing = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.targetUserId), UniqueId.from(input.organizationId));
    if (existing) throw new ArgumentConflictException("User is already a member of this organization");

    const targetUser = await this.userRepository.findById(UniqueId.from(input.targetUserId));
    if (!targetUser) throw new ResourceNotFoundException("User not found");

    const memberPermissions = [Permission.create({ action: Action.READ, resource: ResourceType.ORGANIZATION }), Permission.create({ action: Action.READ, resource: ResourceType.SECRET })];
    const memberRole = Role.create({ name: "member", organizationId: org.id, permissions: memberPermissions });
    const membership = Membership.create({ organizationId: org.id, userId: targetUser.id, roles: [memberRole] });

    await this.membershipRepository.save(membership);
  }
}
