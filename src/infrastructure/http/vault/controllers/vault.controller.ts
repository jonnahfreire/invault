import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import AddShareUsecase from "@application/usecases/vault/add-share.usecase";
import { AddShareDto } from "./dtos/add-share.dto";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Vault")
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
