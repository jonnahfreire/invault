import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";

export const USECASE_PROVIDERS = [
  // CreateOrganizationUseCase,
  // CreateUserUseCase,

  CreateSecretUsecase,
  ListApplicationSecretsUsecase,
];
