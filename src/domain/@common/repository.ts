import { Entity } from "./entity";
import { UniqueId } from "./uniqueid";

export abstract class IRepository<T extends Entity<any>> {
  abstract save(entity: T): Promise<void>;
  abstract findById(id: UniqueId): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract delete(id: UniqueId): Promise<void>;
}
