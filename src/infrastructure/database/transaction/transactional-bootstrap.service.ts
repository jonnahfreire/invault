import { TRANSACTIONAL_METADATA_KEY } from "@application/unit-of-work/transactional.decorator";
import { TransactionalOptions } from "@application/unit-of-work/transactional-options";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core";
import TransactionExecutor from "./transaction-executor";

type UnknownMethod = (...args: unknown[]) => unknown;

@Injectable()
export default class TransactionalBootstrapService implements OnApplicationBootstrap {
  private readonly wrappedInstances = new WeakSet<object>();

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly executor: TransactionExecutor,
  ) {}

  onApplicationBootstrap(): void {
    for (const moduleRef of this.modulesContainer.values()) {
      for (const wrapper of moduleRef.providers.values()) {
        const instance = wrapper.instance;
        if (!this.isWrappableInstance(instance)) continue;

        this.wrapInstanceTransactionalMethods(instance);
        this.wrappedInstances.add(instance);
      }
    }
  }

  private isWrappableInstance(value: unknown): value is object {
    return !!value && typeof value === "object" && !this.wrappedInstances.has(value);
  }

  private wrapInstanceTransactionalMethods(instance: object): void {
    let prototype = Object.getPrototypeOf(instance) as Record<string, unknown> | null;

    while (prototype && prototype !== Object.prototype) {
      const methodNames = Object.getOwnPropertyNames(prototype);
      for (const methodName of methodNames) {
        if (methodName === "constructor") continue;

        const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
        const descriptorValue: unknown = descriptor?.value;
        if (typeof descriptorValue !== "function") continue;

        const prototypeMethod = descriptorValue as UnknownMethod;
        const methodObject = descriptorValue as object;

        const options = Reflect.getMetadata(TRANSACTIONAL_METADATA_KEY, methodObject) as TransactionalOptions | undefined;
        if (!options) continue;

        const originalBound = prototypeMethod.bind(instance);
        const wrappedMethod = (...args: unknown[]) => {
          return this.executor.execute(async () => await originalBound(...args), options);
        };

        Object.defineProperty(instance, methodName, {
          configurable: true,
          writable: true,
          value: wrappedMethod,
        });
      }

      prototype = Object.getPrototypeOf(prototype) as Record<string, unknown> | null;
    }
  }
}
