export abstract class TransactionalContext {
  abstract createTransactionContext<T>(): Promise<T>;
  abstract getTransaction(): any;
  abstract commit(): any;
  abstract rollback(): any;
}
