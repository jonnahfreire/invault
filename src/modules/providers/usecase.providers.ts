import CreateOrganizationUseCase from "@application/usecases/organization/create-organization.usecase";
import GetOrganizationUseCase from "@application/usecases/organization/get-organization.usecase";
import ListUserOrganizationsUseCase from "@application/usecases/organization/list-user-organizations.usecase";
import AddMemberUseCase from "@application/usecases/organization/add-member.usecase";
import RemoveMemberUseCase from "@application/usecases/organization/remove-member.usecase";
import CreateApplicationUseCase from "@application/usecases/application/create-application.usecase";
import GenerateApiKeyUseCase from "@application/usecases/application/generate-api-key.usecase";
import ListApplicationApiKeysUseCase from "@application/usecases/application/list-application-api-keys.usecase";
import CreateServiceAccountUseCase from "@application/usecases/application/create-service-account.usecase";
import ListApplicationServiceAccountsUseCase from "@application/usecases/application/list-application-service-accounts.usecase";
import RevokeServiceAccountUseCase from "@application/usecases/application/revoke-service-account.usecase";
import QueryAuditEventsUseCase from "@application/usecases/audit/query-audit-events.usecase";
import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import GetSecretVersionUseCase from "@application/usecases/secret/get-secret-version.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";
import UpdateSecretUseCase from "@application/usecases/secret/update-secret.usecase";
import RevokeSecretUseCase from "@application/usecases/secret/revoke-secret.usecase";
import RotateSecretUseCase from "@application/usecases/secret/rotate-secret.usecase";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";
import GetUserProfileUseCase from "@application/usecases/user/get-user-profile.usecase";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";
import AuthenticateClientUseCase from "../../application/usecases/auth/autenticate-client.usecase";

export const USECASE_PROVIDERS = [
  CreateUserAccountUseCase,
  GetUserProfileUseCase,
  AuthenticateClientUseCase,
  AddShareUsecase,
  CreateOrganizationUseCase,
  GetOrganizationUseCase,
  ListUserOrganizationsUseCase,
  AddMemberUseCase,
  RemoveMemberUseCase,
  CreateApplicationUseCase,
  GenerateApiKeyUseCase,
  ListApplicationApiKeysUseCase,
  CreateServiceAccountUseCase,
  ListApplicationServiceAccountsUseCase,
  RevokeServiceAccountUseCase,
  QueryAuditEventsUseCase,
  CreateSecretUsecase,
  GetSecretVersionUseCase,
  ListApplicationSecretsUsecase,
  UpdateSecretUseCase,
  RevokeSecretUseCase,
  RotateSecretUseCase,
];
