import { WelcomeController } from "@infra/http/vault/controllers/welcome.controller";
import { SwaggerConfiguration } from "@infra/http/shared/docs/config";
import { ApplicationExceptionFilter } from "@infra/http/shared/filters/application-exception.filter";
import { DomainExceptionFilter } from "@infra/http/shared/filters/domain-exception.filter";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { SecretsController } from "@infra/http/vault/controllers/secrets.controller";
import { VaultController } from "@infra/http/vault/controllers/vault.controller";
import { OrganizationController } from "@infra/http/vault/controllers/organization.controller";
import { UserController } from "@infra/http/vault/controllers/user.controller";

export const HTTP_PROVIDERS = {
  CONTROLLERS: [WelcomeController, VaultController, UserController, OrganizationController, SecretsController],
  FILTERS: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: ApplicationExceptionFilter },
  ],
  SWAGGER: [SwaggerConfiguration],
  GUARDS: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
};
