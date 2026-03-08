import { DatabaseConnection } from "src/application/database/database-connection";
import { TransactionalContext } from "./abstract/transaction-context";
import { Transaction } from "sequelize";
import { Injectable, Scope } from "@nestjs/common";

@Injectable({
  scope: Scope.TRANSIENT,
})
export default class SequelizeTransactionalContext extends TransactionalContext {
  private transaction: Transaction;
  constructor(private readonly database: DatabaseConnection) {
    super();
  }

  async createTransactionContext<Transaction>(): Promise<Transaction> {
    this.transaction = await this.database.createTransaction();
    return this.transaction as Transaction;
  }

  async getTransaction(): Promise<Transaction> {
    if (!this.transaction) await this.createTransactionContext();
    return this.transaction;
  }

  async commit(): Promise<void> {
    await this.transaction.commit();
  }

  async rollback(): Promise<void> {
    await this.transaction.rollback();
  }
}
