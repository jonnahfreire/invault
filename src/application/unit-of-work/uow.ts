import { Injectable, Scope } from "@nestjs/common";
import { logger } from "src/application/config/logger";
import { Transaction } from "sequelize";
import IUnitOfWork from "src/application/unit-of-work/abstract/unit-of-work";
import { TransactionalContext } from "./abstract/transaction-context";

@Injectable({
  scope: Scope.TRANSIENT,
})
export default class UnitOfWork extends IUnitOfWork {
  constructor(private readonly transactionContext: TransactionalContext) {
    super();
  }

  async run<T>(work: (trx: any) => Promise<T>) {
    const transaction = await this.transactionContext.createTransactionContext<Transaction>();

    try {
      const result = await work(transaction);
      await this.transactionContext.commit();
      return result;
    } catch (error) {
      logger.error(`[UnitOfWork] ${error}`);
      await this.transactionContext.rollback();
      throw error;
    }
  }
}
