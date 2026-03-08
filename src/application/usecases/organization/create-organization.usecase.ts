import { Injectable } from "@nestjs/common";
import IUnitOfWork from "src/application/unit-of-work/abstract/unit-of-work";

type CreateOrganizationInput = {};

@Injectable()
export default class CreateOrganizationUseCase {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute(data: CreateOrganizationInput): Promise<void> {
    await this.uow.run<number | null>(async (transaction) => {
      return 1;
    });
  }
}
