import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";
import { AddShareDto } from "../dtos/add-share.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Vault")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("vault")
export class VaultController {
  constructor(private readonly addShareUsecase: AddShareUsecase) {}

  @Post("/add-share")
  @ApiOperation({ summary: "Add Share to Vault", operationId: "addShare" })
  async addShare(@Body() body: AddShareDto) {
    await this.addShareUsecase.execute(body);
    return { message: "Share added successfully" };
  }
}
