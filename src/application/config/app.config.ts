import { ConfigService } from "@nestjs/config";

export enum AppEnvironment {
  Development = "development",
  Homologation = "homolog",
  Production = "production",
  Test = "test",
}

export default class AppConfig {
  readonly port: number;
  readonly nodeEnv: AppEnvironment;
  readonly domainUrl: string;
  readonly systemName: string;
  readonly shamirThreshold: number;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;

  constructor(private readonly config: ConfigService) {
    this.port = Number(this.config.get("PORT", 3000));
    this.domainUrl = this.config.getOrThrow<string>("DOMAIN_URL");
    this.systemName = this.config.getOrThrow<string>("SYSTEM_NAME");
    this.shamirThreshold = Number(this.config.getOrThrow<string>("SHAMIR_THRESHOLD"));
    this.nodeEnv = this.config.getOrThrow<AppEnvironment>("ENVIRONMENT");
    this.jwtSecret = this.config.get<string>("JWT_SECRET", "invault-dev-jwt-secret");
    this.jwtExpiresIn = this.config.get<string>("JWT_EXPIRES_IN", "7d");
  }
}
