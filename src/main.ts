import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { logger } from "./application/config/logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Environment } from "./application/config/environment";
import { SwaggerConfiguration } from "./infrastructure/http/shared/docs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const environment = app.get(Environment);

  app.set("trust proxy", "loopback");
  app.enableCors({
    allowedHeaders: "*",
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = environment.app.corsAllowedOrigins;
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"), false);
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      disableErrorMessages: environment.isProduction,
    }),
  );

  app.get(SwaggerConfiguration).create(app);
  const port = environment.app.port;
  await app.listen(port).then(() => logger.info(`Server running on port: ${port}`));
}

bootstrap().catch(logger.error);
