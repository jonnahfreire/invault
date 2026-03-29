import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateSecretDto } from "./dtos/create-secret.dto";
import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Secrets")
@Controller("secrets")
export class SecretsController {
  constructor(
    private readonly createSecretUsecase: CreateSecretUsecase,
    private readonly listApplicationSecretsUsecase: ListApplicationSecretsUsecase,
  ) {}

  @Post("/")
  @ApiOperation({ summary: "Create Secret", operationId: "createSecret" })
  async createSecret(@Body() body: CreateSecretDto) {
    await this.createSecretUsecase.execute(body);
    return { message: "Secret created successfully" };
  }

  @Get("/applications/:applicationId/secrets")
  @ApiOperation({ summary: "List Application Secrets", operationId: "listApplicationSecrets" })
  async listApplicationSecrets(@Param("applicationId") applicationId: string): Promise<ReturnType<ListApplicationSecretsUsecase["execute"]>> {
    return await this.listApplicationSecretsUsecase.execute({ applicationId });
  }
}
