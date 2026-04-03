import { IRepository } from "@domain/@common/repository";
import { Secret } from "./secret";
import { UniqueId } from "@domain/@common/uniqueid";
export abstract class ISecretRepository implements Omit<IRepository<Secret>, "findAll"> {
  abstract save(entity: Secret, transaction?: any): Promise<void>;
  abstract findById(id: UniqueId, transaction?: any): Promise<Secret | null>;
  abstract findByName(name: string, transaction?: any): Promise<Secret | null>;
  abstract findOneByOwnerId(ownerId: UniqueId, transaction?: any): Promise<Secret | null>;
  abstract findAllByOwnerId(ownerId: UniqueId, transaction?: any): Promise<Secret[]>;
  abstract delete(id: UniqueId, transaction?: any): Promise<void>;
}
