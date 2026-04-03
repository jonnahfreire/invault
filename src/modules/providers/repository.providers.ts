import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { ISecretRepository } from "@domain/secret/secret.repository";
import OrganizationRepository from "@infra/repositories/organization/organization.repository";
import DataEncryptionKeyRepository from "@infra/repositories/key/data-encryption-key.repository";
import SecretRepository from "@infra/repositories/secret/secret-repository";
import IUserRepository from "@domain/identity/user.repository";
import UserRepository from "@infra/repositories/user/user.repository";

export const REPOSITORY_PROVIDERS = [
  { provide: IUserRepository, useClass: UserRepository },
  { provide: IOrganizationRepository, useClass: OrganizationRepository },
  { provide: ISecretRepository, useClass: SecretRepository },
  { provide: IDataEncryptionKeyRepository, useClass: DataEncryptionKeyRepository },
];
