import { Secret } from "@domain/secret/secret";
import { InMemoryRepository } from "./in-memory-repository";
import { IRepository } from "@domain/@common/repository";

export class InMemorySecretRepository extends InMemoryRepository<Secret> implements IRepository<Secret> {}
