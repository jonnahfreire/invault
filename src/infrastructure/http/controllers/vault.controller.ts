import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";
import GetVaultStatusUseCase from "@application/usecases/vault/get-vault-status.usecase";
import ResealVaultUseCase from "@application/usecases/vault/reseal-vault.usecase";
import { AddShareDto } from "../dtos/add-share.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Vault")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("vault")
export class VaultController {
  constructor(
    private readonly addShareUsecase: AddShareUsecase,
    private readonly getVaultStatusUseCase: GetVaultStatusUseCase,
    private readonly resealVaultUseCase: ResealVaultUseCase,
  ) {}

  @Get("/status")
  @ApiOperation({ summary: "Get Vault status", operationId: "getVaultStatus" })
  async status() {
    return this.getVaultStatusUseCase.execute();
  }

  @Post("/add-share")
  @ApiOperation({ summary: "Add Share to Vault", operationId: "addShare" })
  async addShare(@Body() body: AddShareDto) {
    await this.addShareUsecase.execute(body);
    return { message: "Share added successfully" };
  }

  @Post("/reseal")
  @ApiOperation({ summary: "Reseal Vault", operationId: "resealVault" })
  async reseal() {
    await this.resealVaultUseCase.execute();
    return { message: "Vault resealed successfully" };
  }
}
