import { Injectable } from "@nestjs/common";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import { TransactionalOptions } from "@application/unit-of-work/transactional-options";

@Injectable()
export default class TransactionExecutor {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute<T>(work: () => Promise<T>, options?: TransactionalOptions): Promise<T> {
    return this.uow.run(work, options);
  }
}
