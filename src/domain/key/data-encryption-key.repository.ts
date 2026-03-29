import { IRepository } from "@domain/@common/repository";
import { DataEncryptionKey } from "./data-encryption-key";

export abstract class IDataEncryptionKeyRepository extends IRepository<DataEncryptionKey> {}
