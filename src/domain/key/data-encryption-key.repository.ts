import { IRepository } from "@domain/@common/repository";
import { DataEncryptionKey } from "./data-encryption-key";
import { UniqueId } from "@domain/@common/uniqueid";

export abstract class IDataEncryptionKeyRepository implements Pick<IRepository<DataEncryptionKey>, "save" | "findById"> {
  abstract save(entity: DataEncryptionKey, transaction?: any): Promise<void>;
  abstract findById(id: UniqueId, transaction?: any): Promise<DataEncryptionKey | null>;
}
