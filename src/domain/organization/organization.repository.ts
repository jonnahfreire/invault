import { IRepository } from "@domain/@common/repository";
import { UniqueId } from "@domain/@common/uniqueid";
import { Organization } from "./organization";
import { Application } from "./application";

export abstract class IOrganizationRepository extends IRepository<Organization> {
  abstract findTenantById(tenantId: UniqueId, transaction?: any): Promise<Application | null>;
}
