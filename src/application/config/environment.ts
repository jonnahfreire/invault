import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import AppConfig, { AppEnvironment } from "./app.config";
import DatabaseConfig from "./database.config";

@Injectable()
export class Environment {
  readonly app: AppConfig;
  readonly database: DatabaseConfig;

  constructor(config: ConfigService) {
    this.app = new AppConfig(config);
    this.database = new DatabaseConfig(config);
  }

  get isDevelopment(): boolean {
    return this.app.nodeEnv === AppEnvironment.Development;
  }

  get isHomolog(): boolean {
    return this.app.nodeEnv === AppEnvironment.Homologation;
  }

  get isProduction(): boolean {
    return this.app.nodeEnv === AppEnvironment.Production;
  }
}
