import { Injectable } from "@nestjs/common";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import * as crypto from "crypto";

@Injectable()
export default class AuthorizationService {
  constructor(private readonly apiKeyRepository: IApiKeyRepository) {}

  async getClientAuthorization(apiKey: string): Promise<any> {
    if (!apiKey) throw new IllegalAccessException("Não autorizado: API key ausente");

    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex");
    const apiKeyEntity = await this.apiKeyRepository.findByHash(keyHash);

    if (!apiKeyEntity || !apiKeyEntity.isValid()) {
      throw new IllegalAccessException("Não autorizado: API key inválida ou expirada");
    }

    return { applicationId: apiKeyEntity.applicationId.toString() };
  }
}
