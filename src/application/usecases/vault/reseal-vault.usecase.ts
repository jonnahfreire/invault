import { KeyManagerService } from "@application/services/key-manager.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class ResealVaultUseCase {
  constructor(private readonly keyManagerService: KeyManagerService) {}

  async execute(): Promise<void> {
    return Promise.resolve(this.keyManagerService.resealVault());
  }
}
