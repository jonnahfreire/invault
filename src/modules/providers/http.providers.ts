import { SwaggerConfiguration } from "@infra/http/shared/docs/config";
import { ApplicationExceptionFilter } from "@infra/http/shared/filters/application-exception.filter";
import { DomainExceptionFilter } from "@infra/http/shared/filters/domain-exception.filter";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { SecretsController } from "@infra/http/controllers/secrets.controller";
import { VaultController } from "@infra/http/controllers/vault.controller";
import { OrganizationController } from "@infra/http/controllers/organization.controller";
import { UserController } from "@infra/http/controllers/user.controller";

export const HTTP_PROVIDERS = {
  CONTROLLERS: [VaultController, UserController, OrganizationController, SecretsController],
  FILTERS: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: APP_FILTER, useClass: ApplicationExceptionFilter },
  ],
  SWAGGER: [SwaggerConfiguration],
  GUARDS: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
};
