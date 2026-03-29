import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { logger } from "./application/config/logger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Environment } from "./application/config/environment";
import { SwaggerConfiguration } from "./infrastructure/http/shared/docs/config";
import { KeyManagerService } from "@application/services/key-manager.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("trust proxy", "loopback");
  app.enableCors({ allowedHeaders: "*", origin: "*" });

  app.get(SwaggerConfiguration).create(app);
  const port = app.get(Environment).port;
  await app.listen(port).then(() => {
    logger.info(`Server running on port: ${port}`);
  });

  const keyManagerService = app.get(KeyManagerService);
  keyManagerService.addShare("4aeaf76d7276def865dc46c4c892d8f20fdc941d9a6ed0aa3fc3dbd34fe1d9e2bcaffc5b6f");
  keyManagerService.addShare("c630a53185afc7429d9ef6371e949af37aa40573769002423c28ad520aca84cc91a24b0b61");
  keyManagerService.addShare("e578dd81e158f6379faedcb0a851b326bec9d5c641edda803aa66d360ddd85e375dab3ba46");
}

bootstrap().catch((error: Error) => {
  logger.error(error);
});
