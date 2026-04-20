import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateApplicationDto, CreateServiceAccountDto, GenerateApiKeyDto } from "../dtos/application.dto";
import CreateApplicationUseCase from "@application/usecases/application/create-application.usecase";
import GenerateApiKeyUseCase from "@application/usecases/application/generate-api-key.usecase";
import ListApplicationApiKeysUseCase from "@application/usecases/application/list-application-api-keys.usecase";
import CreateServiceAccountUseCase from "@application/usecases/application/create-service-account.usecase";
import ListApplicationServiceAccountsUseCase from "@application/usecases/application/list-application-service-accounts.usecase";
import RevokeServiceAccountUseCase from "@application/usecases/application/revoke-service-account.usecase";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Applications")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("applications")
export class ApplicationController {
  constructor(
    private readonly createApplication: CreateApplicationUseCase,
    private readonly generateApiKey: GenerateApiKeyUseCase,
    private readonly listApplicationApiKeys: ListApplicationApiKeysUseCase,
    private readonly createServiceAccount: CreateServiceAccountUseCase,
    private readonly listServiceAccounts: ListApplicationServiceAccountsUseCase,
    private readonly revokeServiceAccount: RevokeServiceAccountUseCase,
  ) {}

  @Post("/")
  @ApiOperation({ summary: "Create application", operationId: "createApplication" })
  async create(@Body() body: CreateApplicationDto, @CurrentUser() user: { id: string }) {
    const result = await this.createApplication.execute({ ...body, requesterId: user.id });
    return { message: "Application created successfully", id: result.id };
  }

  @Post("/:applicationId/api-keys")
  @ApiOperation({ summary: "Generate API key for application", operationId: "generateApiKey" })
  async generateKey(@Param("applicationId") applicationId: string, @Body() body: GenerateApiKeyDto, @CurrentUser() user: { id: string }) {
    const result = await this.generateApiKey.execute({ applicationId, ...body, requesterId: user.id });
    return {
      message: "API key generated. Store the key securely — it won't be shown again.",
      id: result.id,
      key: result.plainKey,
      name: result.name,
      expiresAt: result.expiresAt,
    };
  }

  @Get("/:applicationId/api-keys")
  @ApiOperation({ summary: "List application API keys", operationId: "listApplicationApiKeys" })
  async listApiKeys(@Param("applicationId") applicationId: string, @CurrentUser() user: { id: string }) {
    return this.listApplicationApiKeys.execute({ applicationId, requesterId: user.id });
  }

  @Post("/:applicationId/service-accounts")
  @ApiOperation({ summary: "Create service account", operationId: "createServiceAccount" })
  async createAccount(@Param("applicationId") applicationId: string, @Body() body: CreateServiceAccountDto, @CurrentUser() user: { id: string }) {
    const result = await this.createServiceAccount.execute({ applicationId, name: body.name, requesterId: user.id });
    return { message: "Service account created successfully", id: result.id };
  }

  @Get("/:applicationId/service-accounts")
  @ApiOperation({ summary: "List service accounts", operationId: "listServiceAccounts" })
  async listAccounts(@Param("applicationId") applicationId: string, @CurrentUser() user: { id: string }) {
    return this.listServiceAccounts.execute({ applicationId, requesterId: user.id });
  }

  @Delete("/:applicationId/service-accounts/:serviceAccountId")
  @ApiOperation({ summary: "Revoke service account", operationId: "revokeServiceAccount" })
  async revokeAccount(@Param("applicationId") applicationId: string, @Param("serviceAccountId") serviceAccountId: string, @CurrentUser() user: { id: string }) {
    await this.revokeServiceAccount.execute({ applicationId, serviceAccountId, requesterId: user.id });
    return { message: "Service account revoked successfully" };
  }
}
