import { Secret } from "@domain/secret/secret";
import { InMemoryRepository } from "../in-memory-repository";
import { IRepository } from "@domain/@common/repository";
import { UniqueId } from "@domain/@common/uniqueid";
import { SecretVersion } from "@domain/secret/secret-version";

export class InMemorySecretRepository extends InMemoryRepository<Secret> implements IRepository<Secret> {
  async findOneByOwnerId(ownerId: UniqueId): Promise<Secret | null> {
    const secrets = Array.from(this.entities.values());
    const secret = secrets.find((entity) => entity.ownerId.toString() === ownerId.toString());
    return Promise.resolve(secret || null);
  }

  async findAllByOwnerId(ownerId: UniqueId): Promise<Secret[]> {
    const secrets = Array.from(this.entities.values());
    return Promise.resolve(secrets.filter((entity) => entity.ownerId.toString() === ownerId.toString()));
  }

  async findVersionBySecretId(secretId: UniqueId): Promise<SecretVersion | null> {
    const secrets = Array.from(this.entities.values());
    const secret = secrets.find((entity) => entity.id.toString() === secretId.toString());
    const secretVersion = secret?.versions.find((version) => version.secretId.toString() === secretId.toString());
    return Promise.resolve(secretVersion || null);
  }
}
