import { Injectable } from "@nestjs/common";
import IUnitOfWork from "src/application/unit-of-work/abstract/unit-of-work";

@Injectable()
export default class CreateOrganizationUseCase {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute(): Promise<void> {
    await this.uow.run<number | null>(() => new Promise(() => 1));
  }
}
