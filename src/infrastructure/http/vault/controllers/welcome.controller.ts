import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiQuery, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Welcome")
@Controller("welcome")
export class WelcomeController {
  constructor() {}

  @Get("/")
  @ApiOperation({ summary: "Welcome", operationId: "welcome" })
  @ApiQuery({ name: "cep", required: true, type: String, description: "" })
  @ApiResponse({ status: 200, description: "" })
  @ApiResponse({ status: 400, description: "" })
  @ApiResponse({ status: 404, description: "" })
  async findAddressFromCep(@Query("cep") cep: string) {
    return { message: "Welcome" };
  }
}
