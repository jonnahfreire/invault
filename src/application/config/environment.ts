import { Injectable } from "@nestjs/common";
import EnvironmentException from "../exceptions/environment.exception";
import { ConfigService } from "@nestjs/config";

class DatabaseEnv {
  constructor(
    readonly user?: string,
    readonly password?: string,
    readonly host?: string,
    readonly port?: number,
    readonly name?: string,
  ) {
    if (!user) throw new EnvironmentException("DATABASE_USER env variable is not defined", "Verify the .env file for the definition of [DATABASE_USER] variable");
    if (!password) throw new EnvironmentException("DATABASE_PASSWORD env variable is not defined", "Verify the .env file for the definition of [DATABASE_PASSWORD] variable");
    if (!host) throw new EnvironmentException("DATABASE_HOST env variable is not defined", "Verify the .env file for the definition of [DATABASE_HOST] variable");
    if (!name) throw new EnvironmentException("DATABASE_NAME env variable is not defined", "Verify the .env file for the definition of [DATABASE_NAME] variable");
  }
}

export enum AppEnvironment {
  Development = "development",
  Homologation = "homolog",
  Production = "production",
  Test = "test",
}

@Injectable()
export class Environment {
  readonly port: number;
  readonly nodeEnv: AppEnvironment;
  readonly domainUrl: string;
  readonly kekSalt: string;
  readonly shamirThreshold: number;
  readonly database: DatabaseEnv;

  constructor(config: ConfigService) {
    this.port = Number(config.get("PORT", 3000));
    this.domainUrl = config.getOrThrow<string>("DOMAIN_URL");
    this.shamirThreshold = Number(config.getOrThrow<string>("SHAMIR_THRESHOLD"));
    this.nodeEnv = config.getOrThrow<AppEnvironment>("ENVIRONMENT");

    this.database = new DatabaseEnv(config.get("DATABASE_USER"), config.get("DATABASE_PASSWORD"), config.get("DATABASE_HOST"), config.get<number>("DATABASE_PORT"), config.get("DATABASE_NAME"));
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === AppEnvironment.Development;
  }

  get isHomolog(): boolean {
    return this.nodeEnv === AppEnvironment.Homologation;
  }

  get isProduction(): boolean {
    return this.nodeEnv === AppEnvironment.Production;
  }
}
