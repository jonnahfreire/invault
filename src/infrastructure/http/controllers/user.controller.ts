import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateClientAccountDto } from "../dtos/create-client-account.dto";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Users")
@Controller("user")
export class UserController {
  constructor(private readonly createUserAccountUseCase: CreateUserAccountUseCase) {}

  @Post("/account")
  @ApiOperation({ summary: "Create User Account", operationId: "createUserAccount" })
  async createUserAccount(@Body() body: CreateClientAccountDto) {
    await this.createUserAccountUseCase.execute(body);
    return { message: "Account created successfully" };
  }
}
