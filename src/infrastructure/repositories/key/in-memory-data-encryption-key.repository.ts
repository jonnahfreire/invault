import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { InMemoryRepository } from "../in-memory-repository";
import { IRepository } from "@domain/@common/repository";

export class InMemoryDataEncryptionKeyRepository extends InMemoryRepository<DataEncryptionKey> implements IRepository<DataEncryptionKey> {}
