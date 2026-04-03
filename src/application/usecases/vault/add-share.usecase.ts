import { KeyManagerService } from "@application/services/key-manager.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class AddShareUsecase {
  constructor(private readonly keyManagerService: KeyManagerService) {}

  async execute(input: Input): Promise<void> {
    return Promise.resolve(this.keyManagerService.addShare(input.share));
  }
}

export interface Input {
  share: string;
}
