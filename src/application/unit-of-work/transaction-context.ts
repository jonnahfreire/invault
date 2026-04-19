export abstract class ITransactionContext {
  abstract createTransaction<T>(): Promise<T>;
  abstract getCurrentTransaction<T>(): T | null;
  abstract runInScope<T>(transaction: any, work: () => Promise<T>): Promise<T>;
  abstract commit(transaction: any): Promise<void>;
  abstract rollback(transaction: any): Promise<void>;
}
