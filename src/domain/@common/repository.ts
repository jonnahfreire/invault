import { Entity } from './entity';
import { UniqueId } from './uniqueid';

export interface IRepository<T extends Entity<any>> {
  save(entity: T): Promise<void>;
  findById(id: UniqueId): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: UniqueId): Promise<void>;
}