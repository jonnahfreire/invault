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
  readonly database: DatabaseEnv;
  readonly useMessaging: boolean;
  readonly messagingClientUrl: string;
  readonly focusUrl: string;
  readonly staticNfeFilesUrl: string;
  readonly appMarketNiche: string;
  readonly domainUrl: string;
  readonly partnerAuthKeyName: string;
  readonly nodeEnv: AppEnvironment;

  constructor(config: ConfigService) {
    this.port = Number(config.get("PORT", 3000));
    this.useMessaging = config.getOrThrow<string>("USE_MESSAGING") === "1";
    this.messagingClientUrl = config.getOrThrow<string>("MESSAGING_CLIENT_URL");
    this.focusUrl = config.getOrThrow<string>("FOCUS_URL");
    this.staticNfeFilesUrl = config.getOrThrow<string>("STATIC_NFE_FILES_URL");
    this.appMarketNiche = config.getOrThrow<string>("APP_MARKET_NICHE");
    this.domainUrl = config.getOrThrow<string>("DOMAIN_URL");
    this.partnerAuthKeyName = config.getOrThrow<string>("PARTNER_AUTH_KEY_NAME");
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
