import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  userId: string;
}

@Injectable()
export default class ListUserOrganizationsUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  async execute(input: Input) {
    if (!input.userId) throw new IllegalArgumentException("User ID is required");

    const memberships = await this.membershipRepository.findByUserId(UniqueId.from(input.userId));

    const organizations = await Promise.all(memberships.map((m) => this.organizationRepository.findById(m.props.organizationId)));

    return organizations
      .filter((org) => org !== null)
      .map((org) => ({
        id: org.id.toString(),
        name: org.name,
        status: org.status,
      }));
  }
}
