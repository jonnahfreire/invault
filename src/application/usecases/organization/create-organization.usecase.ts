import ArgumentConflictException from "@application/exceptions/conflict.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import IUserRepository from "@domain/identity/user.repository";
import { Membership } from "@domain/organization/membership";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Organization } from "@domain/organization/organization";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";
import { Permission } from "../../../domain/permission/permission";
import { Role } from "../../../domain/permission/role";

interface Input {
  name: string;
  ownerId: string;
}

@Injectable()
export default class CreateOrganizationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<void> {
    const existing = await this.organizationRepository.findByName(input.name);
    if (existing) throw new ArgumentConflictException("Organization with this name already exists");

    const owner = await this.userRepository.findById(UniqueId.from(input.ownerId));
    if (!owner) throw new ResourceNotFoundException("Organization owner not found");

    const organization = Organization.create(input.name);
    const ownerPermissions = [
      Permission.create({ action: "read", resource: "organization" }),
      Permission.create({ action: "create", resource: "organization" }),
      Permission.create({ action: "update", resource: "organization" }),
      Permission.create({ action: "delete", resource: "organization" }),
    ];
    const ownerRole = Role.create({ name: "owner", organizationId: organization.id, permissions: ownerPermissions });
    const membership = Membership.create({ organizationId: organization.id, userId: owner.id, roles: [ownerRole] });

    await this.organizationRepository.save(organization);
    await this.membershipRepository.save(membership);
  }
}
