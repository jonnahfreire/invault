import { Secret } from '../../domain/secret/secret';
import { IRepository } from '../../domain/@common/repository';
import { InMemoryRepository } from './in-memory-repository';

export class SecretRepository extends InMemoryRepository<Secret> implements IRepository<Secret> {
  async findByTenantId(organizationId: string): Promise<Secret[]> {
    const all = await this.findAll();
    return all.filter(secret => secret.props.tenantId.toString() === organizationId);
  }
}