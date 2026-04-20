import { UniqueId } from "@domain/@common/uniqueid";
import { Membership } from "./membership";

export abstract class IMembershipRepository {
  abstract save(entity: Membership): Promise<void>;
  abstract findById(id: UniqueId): Promise<Membership | null>;
  abstract findByUserId(userId: UniqueId): Promise<Membership[]>;
  abstract findByOrganizationId(organizationId: UniqueId): Promise<Membership[]>;
  abstract findByUserAndOrganization(userId: UniqueId, organizationId: UniqueId): Promise<Membership | null>;
  abstract delete(id: UniqueId): Promise<void>;
}
