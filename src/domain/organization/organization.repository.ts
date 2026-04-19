import { IRepository } from "@domain/@common/repository";
import { Organization } from "./organization";
import { Application } from "../application/application";
import { UniqueId } from "@domain/@common/uniqueid";

export abstract class IOrganizationRepository extends IRepository<Organization> {
  abstract findByName(name: string): Promise<Organization | null>;
  abstract findApplicationById(id: UniqueId): Promise<Application | null>;
}
