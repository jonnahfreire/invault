import { UniqueId } from "@domain/@common/uniqueid";
import { ServiceAccount } from "./service-account";

export abstract class IServiceAccountRepository {
  abstract save(entity: ServiceAccount): Promise<void>;
  abstract findById(id: UniqueId): Promise<ServiceAccount | null>;
  abstract findByApplicationId(applicationId: UniqueId): Promise<ServiceAccount[]>;
  abstract findByNameAndApplication(name: string, applicationId: UniqueId): Promise<ServiceAccount | null>;
}
