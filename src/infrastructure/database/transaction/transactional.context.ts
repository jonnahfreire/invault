import { AsyncLocalStorage } from "node:async_hooks";
import { Transaction } from "sequelize";
import { Injectable } from "@nestjs/common";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { IDatabaseConnection } from "@application/database/database-connection";

@Injectable()
export default class TransactionContext extends ITransactionContext {
  private static readonly storage = new AsyncLocalStorage<Transaction>();

  constructor(private readonly database: IDatabaseConnection) {
    super();
  }

  async createTransaction<T>(): Promise<T> {
    return await this.database.createTransaction<T>();
  }

  getCurrentTransaction<T>(): T | null {
    return (TransactionContext.storage.getStore() as T) ?? null;
  }

  async runInScope<T>(transaction: Transaction, work: () => Promise<T>): Promise<T> {
    return await TransactionContext.storage.run(transaction, work);
  }

  async commit(transaction: Transaction): Promise<void> {
    await transaction.commit();
  }

  async rollback(transaction: Transaction): Promise<void> {
    await transaction.rollback();
  }
}
