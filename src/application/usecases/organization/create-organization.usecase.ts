import ArgumentConflictException from "@application/exceptions/conflict.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IUserRepository from "@domain/identity/user.repository";
import { Membership } from "@domain/organization/membership";
import { Organization } from "@domain/organization/organization";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";
import { Permission } from "../../../domain/permission/permission";
import { Role } from "../../../domain/permission/role";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";

interface Input {
  name: string;
  ownerId: string;
}

@Injectable()
export default class CreateOrganizationUseCase {
  constructor(
    private readonly uow: IUnitOfWork,
    private readonly userRepository: IUserRepository,
    private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const existing = await this.organizationRepository.findByName(input.name);
    if (existing) throw new ArgumentConflictException("Organization with this name already exists");

    await this.uow.run<void>(async (transaction) => {
      const owner = await this.userRepository.findById(UniqueId.create(input.ownerId));
      if (!owner) throw new ResourceNotFoundException("Organization owner not found");

      const organization = Organization.create(input.name);
      const ownerPermissions = [
        Permission.create({ action: "read", resource: "organization" }),
        Permission.create({ action: "create", resource: "organization" }),
        Permission.create({ action: "update", resource: "organization" }),
        Permission.create({ action: "delete", resource: "organization" }),
      ];
      const ownerRole = Role.create({ name: "owner", organizationId: organization.id, permissions: ownerPermissions });
      // TODO: Save membership to database
      Membership.create({ organizationId: organization.id, userId: owner.id, roles: [ownerRole] });
      await this.organizationRepository.save(organization, transaction);
    });
  }
}
