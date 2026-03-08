import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Welcome")
@Controller("welcome")
export class WelcomeController {
  constructor() {}

  @Get("/")
  @ApiOperation({ summary: "Welcome", operationId: "welcome" })
  welcome() {
    return { message: "Welcome" };
  }
}
