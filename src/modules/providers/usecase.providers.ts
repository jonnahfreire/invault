import CreateOrganizationUseCase from "@application/usecases/organization/create-organization.usecase";
import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import GetSecretVersionUseCase from "@application/usecases/secret/get-secret-version.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";

export const USECASE_PROVIDERS = [CreateUserAccountUseCase, AddShareUsecase, CreateOrganizationUseCase, CreateSecretUsecase, GetSecretVersionUseCase, ListApplicationSecretsUsecase];
