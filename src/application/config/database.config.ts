import { ConfigService } from "@nestjs/config";

export default class DatabaseConfig {
  readonly user: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly name: string;

  constructor(private readonly config: ConfigService) {
    this.user = this.config.getOrThrow<string>("DATABASE_USER");
    this.password = this.config.getOrThrow<string>("DATABASE_PASSWORD");
    this.host = this.config.getOrThrow<string>("DATABASE_HOST");
    this.port = Number(this.config.getOrThrow<string>("DATABASE_PORT"));
    this.name = this.config.getOrThrow<string>("DATABASE_NAME");
  }
}
