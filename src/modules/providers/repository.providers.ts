import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { ISecretRepository } from "@domain/secret/secret.repository";
import OrganizationRepository from "@infra/repositories/organization/organization.repository";
import DataEncryptionKeyRepository from "@infra/repositories/key/data-encryption-key.repository";
import SecretRepository from "@infra/repositories/secret/secret-repository";

import { InMemorySecretRepository } from "@infra/repositories/secret/in-memory-secret.repository";
import { InMemoryDataEncryptionKeyRepository } from "@infra/repositories/key/in-memory-data-encryption-key.repository";

export const REPOSITORY_PROVIDERS = [
  { provide: IOrganizationRepository, useClass: OrganizationRepository },
  // { provide: ISecretRepository, useClass: SecretRepository },
  // { provide: IDataEncryptionKeyRepository, useClass: DataEncryptionKeyRepository },

  { provide: ISecretRepository, useClass: InMemorySecretRepository },
  { provide: IDataEncryptionKeyRepository, useClass: InMemoryDataEncryptionKeyRepository },
];
