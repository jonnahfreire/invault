import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import IApplicationRepository from "@domain/application/application.repository";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import OrganizationRepository from "@infra/repositories/organization/organization.repository";
import DataEncryptionKeyRepository from "@infra/repositories/key/data-encryption-key.repository";
import SecretRepository from "@infra/repositories/secret/secret-repository";
import IUserRepository from "@domain/identity/user.repository";
import { IServiceAccountRepository } from "@domain/identity/service-account.repository";
import UserRepository from "@infra/repositories/user/user.repository";
import IAuditRepository from "@domain/audit/audit.repository";
import AuditRepository from "@infra/repositories/audit/audit.repository";
import MembershipRepository from "@infra/repositories/organization/membership.repository";
import ApplicationRepository from "@infra/repositories/organization/application.repository";
import ApiKeyRepository from "@infra/repositories/organization/api-key.repository";
import ServiceAccountRepository from "@infra/repositories/organization/service-account.repository";

export const REPOSITORY_PROVIDERS = [
  { provide: IAuditRepository, useClass: AuditRepository },
  { provide: IUserRepository, useClass: UserRepository },
  { provide: IOrganizationRepository, useClass: OrganizationRepository },
  { provide: ISecretRepository, useClass: SecretRepository },
  { provide: IDataEncryptionKeyRepository, useClass: DataEncryptionKeyRepository },
  { provide: IMembershipRepository, useClass: MembershipRepository },
  { provide: IApplicationRepository, useClass: ApplicationRepository },
  { provide: IApiKeyRepository, useClass: ApiKeyRepository },
  { provide: IServiceAccountRepository, useClass: ServiceAccountRepository },
];
