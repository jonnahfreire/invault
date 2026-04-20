import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateSecretDto } from "../dtos/create-secret.dto";
import { RotateSecretDto, UpdateSecretDto } from "../dtos/application.dto";
import CreateSecretUsecase from "@application/usecases/secret/create-secret.usecase";
import ListApplicationSecretsUsecase from "@application/usecases/secret/list-application-secrets.usecase";
import GetSecretVersionUseCase from "@application/usecases/secret/get-secret-version.usecase";
import UpdateSecretUseCase from "@application/usecases/secret/update-secret.usecase";
import RevokeSecretUseCase from "@application/usecases/secret/revoke-secret.usecase";
import RotateSecretUseCase from "@application/usecases/secret/rotate-secret.usecase";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Secrets")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("secrets")
export class SecretsController {
  constructor(
    private readonly createSecretUsecase: CreateSecretUsecase,
    private readonly getSecretVersionUsecase: GetSecretVersionUseCase,
    private readonly listApplicationSecretsUsecase: ListApplicationSecretsUsecase,
    private readonly updateSecretUseCase: UpdateSecretUseCase,
    private readonly revokeSecretUseCase: RevokeSecretUseCase,
    private readonly rotateSecretUseCase: RotateSecretUseCase,
  ) {}

  @Post("/")
  @ApiOperation({ summary: "Create Secret", operationId: "createSecret" })
  async createSecret(@Body() body: CreateSecretDto, @CurrentUser() user: { id: string }) {
    await this.createSecretUsecase.execute({ ...body, createdBy: user.id });
    return { message: "Secret created successfully" };
  }

  @Get("/:secretId")
  @ApiOperation({ summary: "Get SecretVersion Data", operationId: "getSecretVersionData" })
  async getSecretVersionData(@Param("secretId") secretId: string, @CurrentUser() user: { id: string }): Promise<ReturnType<GetSecretVersionUseCase["execute"]>> {
    return await this.getSecretVersionUsecase.execute({ secretId, actorId: user.id });
  }

  @Put("/:secretId")
  @ApiOperation({ summary: "Update Secret", operationId: "updateSecret" })
  async updateSecret(@Param("secretId") secretId: string, @Body() body: UpdateSecretDto, @CurrentUser() user: { id: string }) {
    await this.updateSecretUseCase.execute({ secretId, newData: body.newData, updatedBy: user.id, expiresAt: body.expiresAt });
    return { message: "Secret updated successfully" };
  }

  @Delete("/:secretId")
  @ApiOperation({ summary: "Revoke Secret", operationId: "revokeSecret" })
  async revokeSecret(@Param("secretId") secretId: string, @CurrentUser() user: { id: string }) {
    await this.revokeSecretUseCase.execute({ secretId, actorId: user.id });
    return { message: "Secret revoked successfully" };
  }

  @Post("/:secretId/rotate")
  @ApiOperation({ summary: "Rotate Secret", operationId: "rotateSecret" })
  async rotateSecret(@Param("secretId") secretId: string, @Body() body: RotateSecretDto, @CurrentUser() user: { id: string }) {
    await this.rotateSecretUseCase.execute({ secretId, actorId: user.id, expiresAt: body.expiresAt });
    return { message: "Secret rotated successfully" };
  }

  @Get("/applications/:applicationId/secrets")
  @ApiOperation({ summary: "List Application Secrets", operationId: "listApplicationSecrets" })
  async listApplicationSecrets(@Param("applicationId") applicationId: string, @CurrentUser() user: { id: string }): Promise<ReturnType<ListApplicationSecretsUsecase["execute"]>> {
    return await this.listApplicationSecretsUsecase.execute({ applicationId, requesterId: user.id });
  }
}
