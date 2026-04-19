import { Injectable, Logger, Scope } from "@nestjs/common";
import { Transaction } from "sequelize";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { TransactionalOptions } from "@application/unit-of-work/transactional-options";

@Injectable({
  scope: Scope.TRANSIENT,
})
export default class UnitOfWork extends IUnitOfWork {
  private readonly logger = new Logger(UnitOfWork.name);
  constructor(private readonly context: ITransactionContext) {
    super();
  }

  async run<T>(work: () => Promise<T>, options: TransactionalOptions = {}) {
    const propagation = options.propagation ?? "REQUIRED";
    const activeTransaction = this.context.getCurrentTransaction<Transaction>();
    if (activeTransaction && propagation === "REQUIRED") return await work();

    const transaction = await this.context.createTransaction<Transaction>();

    return await this.context.runInScope(transaction, async () => {
      try {
        const result = await work();
        await this.context.commit(transaction);
        return result;
      } catch (error: any) {
        this.logger.error("Transaction Rolled Back", {
          event: "UNIT_OF_WORK_ERROR",
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });

        if (this.shouldRollback(error, options)) {
          await this.context.rollback(transaction);
        } else {
          await this.context.commit(transaction);
        }

        throw error;
      }
    });
  }

  private shouldRollback(error: unknown, options: TransactionalOptions): boolean {
    const noRollbackFor = options.noRollbackFor ?? [];
    if (noRollbackFor.some((errorType) => error instanceof errorType)) return false;

    const rollbackFor = options.rollbackFor ?? [];
    if (!rollbackFor.length) return true;

    return rollbackFor.some((errorType) => error instanceof errorType);
  }
}
