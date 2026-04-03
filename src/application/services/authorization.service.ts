import { Injectable } from "@nestjs/common";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
@Injectable()
export default class AuthorizationService {
  constructor() {}

  async getClientAuthorization(apiKey: string): Promise<any> {
    if (!apiKey) throw new IllegalAccessException("Não autorizado: API key ausente");

    return new Promise(() => "");
  }
}
