import { Entity } from "../../domain/@common/entity";
import { UniqueId } from "../../domain/@common/uniqueid";
import { IRepository } from "../../domain/@common/repository";

export class InMemoryRepository<T extends Entity<any>> implements IRepository<T> {
  protected readonly entities = new Map<string, T>();

  async save(entity: T): Promise<void> {
    await Promise.resolve(this.entities.set(entity.id.toString(), entity));
  }

  async findById(id: UniqueId): Promise<T | null> {
    const entity = this.entities.get(id.toString());
    if (!entity) return null;

    return await Promise.resolve(entity);
  }

  async findAll(): Promise<T[]> {
    return await Promise.resolve(Array.from(this.entities.values()));
  }

  async delete(id: UniqueId): Promise<void> {
    await Promise.resolve(() => this.entities.delete(id.toString()));
  }
}
