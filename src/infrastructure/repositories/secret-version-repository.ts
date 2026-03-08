import { SecretVersion } from "../../domain/secret/secret-version";
import { IRepository } from "../../domain/@common/repository";
import { InMemoryRepository } from "./in-memory-repository";

export class SecretVersionRepository extends InMemoryRepository<SecretVersion> implements IRepository<SecretVersion> {
  async findBySecretId(secretId: string): Promise<SecretVersion[]> {
    const all = await this.findAll();
    return all.filter((version) => version.props.secretId.toString() === secretId);
  }

  async findLatestBySecretId(secretId: string): Promise<SecretVersion | null> {
    const versions = await this.findBySecretId(secretId);
    return versions.sort((a, b) => b.props.version - a.props.version)[0] || null;
  }
}
