import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  organizationId: string;
}

@Injectable()
export default class GetOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  async execute(input: Input) {
    const org = await this.organizationRepository.findById(UniqueId.from(input.organizationId));
    if (!org) throw new ResourceNotFoundException("Organization not found");

    const memberships = await this.membershipRepository.findByOrganizationId(org.id);

    return {
      id: org.id.toString(),
      name: org.name,
      status: org.status,
      memberCount: memberships.length,
    };
  }
}
