import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { logger } from "./application/config/logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Environment } from "./application/config/environment";
import { SwaggerConfiguration } from "./infrastructure/http/shared/docs/config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("trust proxy", "loopback");
  app.enableCors({ allowedHeaders: "*", origin: "*" });

  app.get(SwaggerConfiguration).create(app);
  const port = app.get(Environment).port;
  await app.listen(port).then(() => {
    logger.info(`Server running on port: ${port}`);
  });
}

bootstrap().catch((error: Error) => {
  logger.error(error);
});
