import { UniqueId } from "@domain/@common/uniqueid";
import { Secret } from "../../domain/secret/secret";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { SecretVersion } from "@domain/secret/secret-version";
import SecretModel from "@infra/database/models/secret/secret.model";
import SecretVersionModel from "@infra/database/models/secret/secret-version.model";

export class SecretRepository implements ISecretRepository {
  async save(entity: Secret, transaction?: any): Promise<void> {
    await SecretModel.create(
      {
        id: entity.id.toString(),
        name: entity.props.name,
        type: entity.props.type,
        applicationId: entity.props.applicationId,
        status: entity.props.status,
        createdBy: entity.props.createdBy,
      },
      { transaction },
    );
  }

  async findById(id: UniqueId, transaction?: any): Promise<Secret | null> {
    const secret = await SecretModel.findOne({ where: { id: id.toString() }, transaction });
    return secret ? secret.toDomain() : null;
  }

  async findAll(transaction?: any): Promise<Secret[]> {
    const secrets = await SecretModel.findAll({ transaction });
    return secrets.map((secret) => secret.toDomain());
  }

  async delete(id: UniqueId, transaction?: any): Promise<void> {
    await SecretModel.destroy({ where: { id: id.toString() }, transaction });
  }

  async findOneByTenantId(tenantId: UniqueId, transaction?: any): Promise<Secret | null> {
    const secret = await SecretModel.findOne({ where: { tenantId: tenantId.toString() }, transaction });
    return secret ? secret.toDomain() : null;
  }

  async findAllByTenantId(tenantId: UniqueId, transaction?: any): Promise<Secret[]> {
    const secrets = await SecretModel.findAll({ where: { tenantId: tenantId.toString() }, transaction });
    return secrets.map((secret) => secret.toDomain());
  }

  // SecretVersion Area
  async findVersionBySecretId(secretId: UniqueId, transaction?: any): Promise<SecretVersion | null> {
    const secretVersion = await SecretVersionModel.findOne({ where: { secretId: secretId.toString() }, transaction });
    return secretVersion ? secretVersion.toDomain() : null;
  }

  async findLatestVersionBySecretId(secretId: UniqueId, transaction?: any): Promise<SecretVersion | null> {
    const secretVersion = await SecretVersionModel.findOne({ where: { secretId: secretId.toString() }, transaction, order: [["version", "DESC"]] });
    return secretVersion ? secretVersion.toDomain() : null;
  }
}
