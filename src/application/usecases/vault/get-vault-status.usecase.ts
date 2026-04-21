import { KeyManagerService } from "@application/services/key-manager.service";
import { Injectable } from "@nestjs/common";

interface Output {
  sealed: boolean;
  sharesLoaded: number;
  threshold: number;
}

@Injectable()
export default class GetVaultStatusUseCase {
  constructor(private readonly keyManagerService: KeyManagerService) {}

  async execute(): Promise<Output> {
    return Promise.resolve(this.keyManagerService.getVaultStatus());
  }
}
