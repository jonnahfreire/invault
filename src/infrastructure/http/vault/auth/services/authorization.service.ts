import { Injectable } from "@nestjs/common";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
import AuthorizationResult from "src/domain/partner/entities/authorization-result";
import IPartnerRepository from "src/domain/partner/partner-repository";
@Injectable()
export default class AuthorizationService {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async getPartnerAuthorization(apiKey: string): Promise<AuthorizationResult> {
    if (!apiKey) throw new IllegalAccessException("Não autorizado: API key ausente");

    return await this.partnerRepository.getAuthorization(apiKey);
  }
}
