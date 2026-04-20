import IllegalAccessException from "@application/exceptions/illegal-access.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IApplicationRepository from "@domain/application/application.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { Injectable } from "@nestjs/common";

type AccessMode = "read" | "write";

@Injectable()
export class SecretAuthorizationService {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
  ) {}

  async ensureAuthorized(ownerType: SecretOwner, ownerId: UniqueId, actorId: string, mode: AccessMode): Promise<void> {
    if (!actorId) throw new IllegalAccessException("Unauthorized: missing actor");

    if (ownerType === SecretOwner.USER) {
      if (ownerId.toString() !== actorId) {
        throw new IllegalAccessException("Unauthorized: this secret belongs to another user");
      }
      return;
    }

    if (ownerType === SecretOwner.APPLICATION) {
      const application = await this.applicationRepository.findById(ownerId);
      if (!application) throw new ResourceNotFoundException("Application not found for secret authorization");

      const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(actorId), application.organizationId);
      if (!membership) throw new IllegalAccessException("Unauthorized: you are not a member of this organization");

      if (mode === "write") {
        const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
        if (!isOwnerOrAdmin) throw new IllegalAccessException("Unauthorized: insufficient permissions to modify this secret");
      }
      return;
    }

    if (ownerType === SecretOwner.ORGANIZATION) {
      const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(actorId), ownerId);
      if (!membership) throw new IllegalAccessException("Unauthorized: you are not a member of this organization");

      if (mode === "write") {
        const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
        if (!isOwnerOrAdmin) throw new IllegalAccessException("Unauthorized: insufficient permissions to modify this secret");
      }
      return;
    }

    throw new IllegalAccessException("Unauthorized: unsupported secret owner type");
  }
}
