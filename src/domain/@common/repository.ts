import { Entity } from "./entity";
import { UniqueId } from "./uniqueid";

export abstract class IRepository<T extends Entity<any>> {
  abstract save(entity: T, transaction?: any): Promise<void>;
  abstract findById(id: UniqueId, transaction?: any): Promise<T | null>;
  abstract findAll(transaction?: any): Promise<T[]>;
  abstract delete(id: UniqueId, transaction?: any): Promise<void>;
}
