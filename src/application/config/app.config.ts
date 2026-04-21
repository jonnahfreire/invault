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
  readonly corsAllowedOrigins: string[];

  constructor(private readonly config: ConfigService) {
    this.port = Number(this.config.get("PORT", 3000));
    this.domainUrl = this.config.getOrThrow<string>("DOMAIN_URL");
    this.systemName = this.config.getOrThrow<string>("SYSTEM_NAME");
    this.shamirThreshold = Number(this.config.getOrThrow<string>("SHAMIR_THRESHOLD"));
    this.nodeEnv = this.config.getOrThrow<AppEnvironment>("ENVIRONMENT");
    this.jwtSecret = this.config.getOrThrow<string>("JWT_SECRET");
    this.jwtExpiresIn = this.config.get<string>("JWT_EXPIRES_IN", "8h");
    this.corsAllowedOrigins = this.resolveCorsAllowedOrigins();
  }

  private resolveCorsAllowedOrigins(): string[] {
    const raw = this.config.get<string>("CORS_ALLOWED_ORIGINS", "*");
    return raw
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
}
