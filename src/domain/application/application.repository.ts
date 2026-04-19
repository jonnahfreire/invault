import { IRepository } from "../@common/repository";
import type { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";

export default abstract class IApplicationRepository implements Omit<IRepository<Application>, "findAll"> {
  abstract save(entity: Application): Promise<void>;
  abstract findById(id: UniqueId): Promise<Application | null>;
  abstract findAllByOrganizationId(organizationId: UniqueId): Promise<Application[]>;
  abstract delete(id: UniqueId): Promise<void>;
}
