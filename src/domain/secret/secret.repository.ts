import { IRepository } from "@domain/@common/repository";
import { Secret } from "./secret";
import { SecretVersion } from "./secret-version";
import { UniqueId } from "@domain/@common/uniqueid";

export abstract class ISecretRepository extends IRepository<Secret> {
  abstract findOneByTenantId(tenantId: UniqueId, transaction?: any): Promise<Secret | null>;
  abstract findAllByTenantId(tenantId: UniqueId, transaction?: any): Promise<Secret[]>;
  abstract findVersionBySecretId(secretId: UniqueId, transaction?: any): Promise<SecretVersion | null>;
  abstract findLatestVersionBySecretId(secretId: UniqueId, transaction?: any): Promise<SecretVersion | null>;
}
