import { IRepository } from "../@common/repository";
import type { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";

export default abstract class IApplicationRepository implements Omit<IRepository<Application>, "findAll"> {
  abstract save(entity: Application, transaction?: any): Promise<void>;
  abstract findById(id: UniqueId, transaction?: any): Promise<Application | null>;
  abstract findAllByOrganizationId(organizationId: UniqueId, transaction?: any): Promise<Application[]>;
  abstract delete(id: UniqueId, transaction?: any): Promise<void>;
}
