import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { Environment } from "src/application/config/environment";
import { ThrottlerModule } from "@nestjs/throttler";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IdempotencyMiddleware } from "src/infrastructure/http/shared/middlewares/idempotency.middleware";
import { USECASE_PROVIDERS } from "./providers/usecase.providers";
import { REPOSITORY_PROVIDERS } from "./providers/repository.providers";
import { SERVICE_PROVIDERS } from "./providers/service.providers";
import { HTTP_PROVIDERS } from "./providers/http.providers";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 1000, limit: 10 }],
      errorMessage: "Muitas requisições, por favor tente novamente mais tarde.",
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET", "invault-dev-jwt-secret"),
        signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN", "7d") as any },
      }),
    }),
  ],
  controllers: [...HTTP_PROVIDERS.CONTROLLERS],
  providers: [Environment, ...HTTP_PROVIDERS.SWAGGER, ...HTTP_PROVIDERS.GUARDS, ...HTTP_PROVIDERS.FILTERS, ...SERVICE_PROVIDERS, ...REPOSITORY_PROVIDERS, ...USECASE_PROVIDERS],
})
export class InvaultAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware).forRoutes("api/v1/idp");
  }
}
