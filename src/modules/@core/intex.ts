import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerModule } from "@nestjs/throttler";
import { CORE_EXPORTS, CORE_PROVIDERS } from "./providers";
import { Environment } from "../../application/config/environment";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 1000, limit: 10 }],
      errorMessage: "Muitas requisições, por favor tente novamente mais tarde.",
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [Environment],
      useFactory: (environment: Environment) => {
        return {
          secret: environment.app.jwtSecret as any,
          signOptions: { expiresIn: environment.app.jwtExpiresIn as any },
        };
      },
    }),
  ],
  providers: [...CORE_PROVIDERS],
  exports: [...CORE_EXPORTS],
})
export class CoreModule {}
