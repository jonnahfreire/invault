import { IDatabaseConnection } from "src/application/database/database-connection";
import { ITransactionContext } from "../../../application/unit-of-work/transaction-context";
import { Transaction } from "sequelize";
import { Injectable, Scope } from "@nestjs/common";

@Injectable({
  scope: Scope.TRANSIENT,
})
export default class TransactionalContext extends ITransactionContext {
  private transaction: Transaction | undefined;
  constructor(private readonly database: IDatabaseConnection) {
    super();
  }

  async createTransactionContext<Transaction>(): Promise<Transaction> {
    this.transaction = await this.database.createTransaction();
    return this.transaction as Transaction;
  }

  async getTransaction(): Promise<Transaction> {
    if (!this.transaction) await this.createTransactionContext();
    return this.transaction!;
  }

  async commit(): Promise<void> {
    if (!this.transaction) return;
    await this.transaction.commit();
  }

  async rollback(): Promise<void> {
    if (!this.transaction) return;
    await this.transaction.rollback();
  }
}
