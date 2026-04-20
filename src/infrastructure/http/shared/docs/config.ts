import { INestApplication, Injectable, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Environment } from "src/application/config/environment";
import { InvaultAppModule } from "../../../../modules/invault.module";

@Injectable()
export class SwaggerConfiguration {
  private readonly localhostUrl: string;
  private readonly apiUrl: string;
  private readonly apiKeyHeaderName: string;

  constructor(private readonly environment: Environment) {
    this.localhostUrl = `http://localhost:${this.environment.app.port}`;
    this.apiUrl = this.environment.app.domainUrl;
    this.apiKeyHeaderName = "apikey"; // this.environment.partnerAuthKeyName;
  }

  create(app: INestApplication<any>) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: "1",
      prefix: "api/v",
    });

    const config = new DocumentBuilder()
      .setTitle("Invault Api")
      .setVersion("1.0")
      .setDescription("Documentação da Api para integração com o Invault")
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "Bearer")
      .addApiKey({ type: "apiKey", name: this.apiKeyHeaderName, in: "header" }, "ApiKey");

    this.configureServerUrls(config);
    const document = SwaggerModule.createDocument(app, config.build(), {
      include: [InvaultAppModule],
    });

    SwaggerModule.setup("/docs", app, document, {
      jsonDocumentUrl: "/docs/json",
    });
  }

  private configureServerUrls(config: DocumentBuilder): void {
    if (this.environment.isDevelopment) {
      config.addServer(this.localhostUrl, "Local");
      config.addServer(this.apiUrl, "Homologação");
    }

    if (this.environment.isHomolog) {
      config.addServer(this.apiUrl, "Homologação");
    }

    if (this.environment.isProduction) {
      config.addServer(this.apiUrl, "Produção");
    }
  }
}
