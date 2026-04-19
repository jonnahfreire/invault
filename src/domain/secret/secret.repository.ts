import { IRepository } from "@domain/@common/repository";
import { Secret } from "./secret";
import { UniqueId } from "@domain/@common/uniqueid";
export abstract class ISecretRepository implements Omit<IRepository<Secret>, "findAll"> {
  abstract save(entity: Secret): Promise<void>;
  abstract findById(id: UniqueId): Promise<Secret | null>;
  abstract findByName(name: string): Promise<Secret | null>;
  abstract findOneByOwnerId(ownerId: UniqueId): Promise<Secret | null>;
  abstract findAllByOwnerId(ownerId: UniqueId): Promise<Secret[]>;
  abstract delete(id: UniqueId): Promise<void>;
}
