import { TransactionalOptions } from "./transactional-options";

export default abstract class IUnitOfWork {
  abstract run<T>(work: () => Promise<T>, options?: TransactionalOptions): Promise<T>;
}
