export default abstract class IUnitOfWork {
  abstract run<T>(work: (trx: any) => Promise<T>): Promise<T>;
}
