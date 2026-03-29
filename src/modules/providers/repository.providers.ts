import { ISecretRepository } from "@domain/secret/secret.repository";
import { InMemorySecretRepository } from "@infra/repositories/secret/in-memory-secret.repository";

export const REPOSITORY_PROVIDERS = [{ provide: ISecretRepository, useClass: InMemorySecretRepository }];
