import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateClientAccountDto } from "../dtos/create-client-account.dto";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";
import GetUserProfileUseCase from "@application/usecases/user/get-user-profile.usecase";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Public } from "../decorators/public.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Users")
@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(
    private readonly createUserAccountUseCase: CreateUserAccountUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Public()
  @Post("/account")
  @ApiOperation({ summary: "Create User Account", operationId: "createUserAccount" })
  async createUserAccount(@Body() body: CreateClientAccountDto) {
    await this.createUserAccountUseCase.execute(body);
    return { message: "Account created successfully" };
  }

  @Get("/profile")
  @ApiSecurity("Bearer")
  @ApiOperation({ summary: "Get current user profile", operationId: "getUserProfile" })
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.getUserProfileUseCase.execute({ userId: user.id });
  }
}
