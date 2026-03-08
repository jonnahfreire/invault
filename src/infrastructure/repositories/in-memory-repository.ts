import { Entity } from '../../domain/@common/entity';
import { UniqueId } from '../../domain/@common/uniqueid';
import { IRepository } from '../../domain/@common/repository';

export class InMemoryRepository<T extends Entity<any>> implements IRepository<T> {
  protected readonly entities = new Map<string, T>();

  async save(entity: T): Promise<void> {
    this.entities.set(entity.id.toString(), entity);
  }

  async findById(id: UniqueId): Promise<T | null> {
    return this.entities.get(id.toString()) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.entities.values());
  }

  async delete(id: UniqueId): Promise<void> {
    this.entities.delete(id.toString());
  }
}