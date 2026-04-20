import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import AuthenticateClientUseCase from "@application/usecases/auth/autenticate-client.usecase";
import CreateUserAccountUseCase from "@application/usecases/user/create-user-account.usecase";
import { LoginDto } from "../dtos/login.dto";
import { CreateClientAccountDto } from "../dtos/create-client-account.dto";
import { Public } from "../decorators/public.decorator";

@Throttle({ default: { ttl: 1000, limit: 5 } })
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authenticateClientUseCase: AuthenticateClientUseCase,
    private readonly createUserAccountUseCase: CreateUserAccountUseCase,
  ) {}

  @Public()
  @Post("/login")
  @ApiOperation({ summary: "Authenticate user and return JWT", operationId: "login" })
  async login(@Body() body: LoginDto) {
    return await this.authenticateClientUseCase.execute(body);
  }

  @Public()
  @Post("/register")
  @ApiOperation({ summary: "Register a new user account", operationId: "register" })
  async register(@Body() body: CreateClientAccountDto) {
    await this.createUserAccountUseCase.execute(body);
    return { message: "Account created successfully" };
  }
}
