import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { Transaction } from "sequelize";

export abstract class BaseRepository {
  constructor(protected readonly context: ITransactionContext) {}

  protected get transaction(): Transaction | undefined {
    return this.context.getCurrentTransaction<Transaction>() ?? undefined;
  }
}
