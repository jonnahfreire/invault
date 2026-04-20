import { UniqueId } from "@domain/@common/uniqueid";
import { ApiKey } from "./api-key";

export abstract class IApiKeyRepository {
  abstract save(entity: ApiKey): Promise<void>;
  abstract findById(id: UniqueId): Promise<ApiKey | null>;
  abstract findByHash(keyHash: string): Promise<ApiKey | null>;
  abstract findByApplicationId(applicationId: UniqueId): Promise<ApiKey[]>;
  abstract delete(id: UniqueId): Promise<void>;
}
