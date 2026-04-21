import { SwaggerConfiguration } from "@infra/http/shared/docs/config";
import { ApplicationExceptionFilter } from "@infra/http/shared/filters/application-exception.filter";
import { DomainExceptionFilter } from "@infra/http/shared/filters/domain-exception.filter";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { SecretsController } from "@infra/http/controllers/secrets.controller";
import { VaultController } from "@infra/http/controllers/vault.controller";
import { OrganizationController } from "@infra/http/controllers/organization.controller";
import { UserController } from "@infra/http/controllers/user.controller";
import { AuthController } from "@infra/http/controllers/auth.controller";
import { ApplicationController } from "@infra/http/controllers/application.controller";
import { AuditController } from "@infra/http/controllers/audit.controller";
import { JwtAuthGuard } from "@infra/http/guards/jwt-auth.guard";
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
import { IDatabaseConnection } from "@application/database/database-connection";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import TransactionContext from "@infra/database/transaction/transactional.context";
import UnitOfWork from "@infra/database/transaction/unit-of-work";
import SequelizeConnection from "@infra/database/sequelize.connection";
import AuthorizationService from "@application/services/authorization.service";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";
import TransactionExecutor from "src/infrastructure/database/transaction/transaction-executor";
import TransactionalBootstrapService from "src/infrastructure/database/transaction/transactional-bootstrap.service";
import CreateOrganizationUseCase from "@application/usecases/organization/create-organization.usecase";
import GetOrganizationUseCase from "@application/usecases/organization/get-organization.usecase";
import ListUserOrganizationsUseCase from "@application/usecases/organization/list-user-organizations.usecase";
import AddMemberUseCase from "@application/usecases/organization/add-member.usecase";
import RemoveMemberUseCase from "@application/usecases/organization/remove-member.usecase";
import CreateApplicationUseCase from "@application/usecases/application/create-application.usecase";
import GenerateApiKeyUseCase from "@application/usecases/application/generate-api-key.usecase";
import ListApplicationApiKeysUseCase from "@application/usecases/application/list-application-api-keys.usecase";
import RevokeApiKeyUseCase from "@application/usecases/application/revoke-api-key.usecase";
import CreateServiceAccountUseCase from "@application/usecases/application/create-service-account.usecase";
import ListApplicationServiceAccountsUseCase from "@application/usecases/application/list-application-service-accounts.usecase";
import RevokeServiceAccountUseCase from "@application/usecases/application/revoke-service-account.usecase";
import QueryAuditEventsUseCase from "@application/usecases/audit/query-audit-events.usecase";
import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import GetSecretVersionUseCase from "@application/usecases/secret/get-secret-version.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";
import ListApplicationSecretsByApiKeyUseCase from "@application/usecases/secret/list-application-secrets-by-api-key.usecase";
import UpdateSecretUseCase from "@application/usecases/secret/update-secret.usecase";
import RevokeSecretUseCase from "@application/usecases/secret/revoke-secret.usecase";
import RotateSecretUseCase from "@application/usecases/secret/rotate-secret.usecase";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";
import GetUserProfileUseCase from "@application/usecases/user/get-user-profile.usecase";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";
import GetVaultStatusUseCase from "@application/usecases/vault/get-vault-status.usecase";
import ResealVaultUseCase from "@application/usecases/vault/reseal-vault.usecase";
import AuthenticateClientUseCase from "../../application/usecases/auth/autenticate-client.usecase";
import { Environment } from "src/application/config/environment";

export const HTTP_PROVIDERS = {
  CONTROLLERS: [AuthController, VaultController, UserController, OrganizationController, SecretsController, ApplicationController, AuditController],
  FILTERS: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: ApplicationExceptionFilter },
  ],
  SWAGGER: [SwaggerConfiguration],
  GUARDS: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, { provide: APP_GUARD, useClass: JwtAuthGuard }, JwtAuthGuard],
};

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

export const SERVICE_PROVIDERS = [
  AuthorizationService,
  SecretAuthorizationService,
  KeyManagerService,
  AuditService,
  TransactionExecutor,
  TransactionalBootstrapService,
  { provide: IUnitOfWork, useClass: UnitOfWork },
  { provide: IDatabaseConnection, useClass: SequelizeConnection },
  { provide: ITransactionContext, useClass: TransactionContext },
];

export const USECASE_PROVIDERS = [
  CreateUserAccountUseCase,
  GetUserProfileUseCase,
  AuthenticateClientUseCase,
  AddShareUsecase,
  GetVaultStatusUseCase,
  ResealVaultUseCase,
  CreateOrganizationUseCase,
  GetOrganizationUseCase,
  ListUserOrganizationsUseCase,
  AddMemberUseCase,
  RemoveMemberUseCase,
  CreateApplicationUseCase,
  GenerateApiKeyUseCase,
  ListApplicationApiKeysUseCase,
  RevokeApiKeyUseCase,
  CreateServiceAccountUseCase,
  ListApplicationServiceAccountsUseCase,
  RevokeServiceAccountUseCase,
  QueryAuditEventsUseCase,
  CreateSecretUsecase,
  GetSecretVersionUseCase,
  ListApplicationSecretsUsecase,
  ListApplicationSecretsByApiKeyUseCase,
  UpdateSecretUseCase,
  RevokeSecretUseCase,
  RotateSecretUseCase,
];

export const CORE_PROVIDERS = [Environment, ...HTTP_PROVIDERS.SWAGGER, ...HTTP_PROVIDERS.GUARDS, ...HTTP_PROVIDERS.FILTERS, ...SERVICE_PROVIDERS, ...REPOSITORY_PROVIDERS, ...USECASE_PROVIDERS];

export const CORE_EXPORTS = [Environment, SwaggerConfiguration, JwtAuthGuard, ...SERVICE_PROVIDERS, ...REPOSITORY_PROVIDERS, ...USECASE_PROVIDERS];
