import { TransactionalOptions } from "./transactional-options";

export const TRANSACTIONAL_METADATA_KEY = Symbol("TRANSACTIONAL_METADATA_KEY");

export function Transactional(options: TransactionalOptions = {}): MethodDecorator {
  return (_target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as object | undefined;
    if (!method) return descriptor;

    Reflect.defineMetadata(TRANSACTIONAL_METADATA_KEY, options, method);
    return descriptor;
  };
}
