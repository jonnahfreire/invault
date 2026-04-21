import { Injectable } from "@nestjs/common";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import { AuditService } from "./audit.service";
import { UniqueId } from "@domain/@common/uniqueid";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import * as crypto from "crypto";

export interface ClientAuthorization {
  authorized: true;
  principalType: "application";
  applicationId: string;
}

@Injectable()
export default class AuthorizationService {
  constructor(
    private readonly apiKeyRepository: IApiKeyRepository,
    private readonly auditService: AuditService,
  ) {}

  async getClientAuthorization(apiKey: string): Promise<ClientAuthorization> {
    if (!apiKey) throw new IllegalAccessException("Não autorizado: API key ausente");

    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
    const apiKeyEntity = await this.apiKeyRepository.findByHash(keyHash);

    if (!apiKeyEntity || !apiKeyEntity.isValid()) {
      throw new IllegalAccessException("Não autorizado: API key inválida ou expirada");
    }

    await this.auditService.logEvent(
      UniqueId.create(apiKeyEntity.applicationId.toString()),
      "api_key.used",
      apiKeyEntity.applicationId,
      Aes256Wrapper.hashData({
        apiKeyId: apiKeyEntity.id.toString(),
        applicationId: apiKeyEntity.applicationId.toString(),
        name: apiKeyEntity.name,
      }),
      undefined,
      {
        apiKeyId: apiKeyEntity.id.toString(),
        applicationId: apiKeyEntity.applicationId.toString(),
      },
    );

    return {
      authorized: true,
      principalType: "application",
      applicationId: apiKeyEntity.applicationId.toString(),
    };
  }
}
