export abstract class ITransactionContext {
  abstract createTransactionContext<T>(): Promise<T>;
  abstract getTransaction(): any;
  abstract commit(): any;
  abstract rollback(): any;
}
