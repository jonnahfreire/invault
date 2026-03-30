import { UniqueId } from "@domain/@common/uniqueid";
import { Secret } from "../../../domain/secret/secret";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { SecretVersion } from "@domain/secret/secret-version";
import { Injectable } from "@nestjs/common";
import SecretModel from "@infra/database/models/secret/secret.model";
import SecretVersionModel from "@infra/database/models/secret/secret-version.model";

@Injectable()
export default class SecretRepository implements ISecretRepository {
  async save(entity: Secret, transaction?: any): Promise<void> {
    await SecretModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.name,
        type: entity.type,
        ownerId: entity.ownerId,
        ownerType: entity.ownerType,
        status: entity.status,
        currentVersionId: entity.currentVersionId,
        createdBy: entity.createdBy,
      },
      { transaction },
    );

    for (const version of entity.versions) {
      await SecretVersionModel.upsert(
        {
          id: version.id.toString(),
          secretId: version.secretId.toString(),
          dekId: version.dekId.toString(),
          payload: version.payload,
          version: version.version,
          createdBy: version.createdBy,
          expiresAt: version.expiresAt,
        },
        { transaction },
      );
    }
  }

  async findById(id: UniqueId, transaction?: any): Promise<Secret | null> {
    const secret = await SecretModel.findOne({
      where: { id: id.toString() },
      include: [{ model: SecretVersionModel, as: "currentVersion" }],
      transaction,
    });
    return secret ? secret.toDomain() : null;
  }

  async findAll(transaction?: any): Promise<Secret[]> {
    const secrets = await SecretModel.findAll({
      include: [{ model: SecretVersionModel, as: "currentVersion" }],
      transaction,
    });
    return secrets.map((secret) => secret.toDomain());
  }

  async delete(id: UniqueId, transaction?: any): Promise<void> {
    await SecretModel.destroy({ where: { id: id.toString() }, transaction });
  }

  async findOneByOwnerId(ownerId: UniqueId, transaction?: any): Promise<Secret | null> {
    const secret = await SecretModel.findOne({
      where: { ownerId: ownerId.toString() },
      include: [{ model: SecretVersionModel, as: "currentVersion" }],
      transaction,
    });
    return secret ? secret.toDomain() : null;
  }

  async findAllByOwnerId(ownerId: UniqueId, transaction?: any): Promise<Secret[]> {
    const secrets = await SecretModel.findAll({
      where: { ownerId: ownerId.toString() },
      include: [{ model: SecretVersionModel, as: "currentVersion" }],
      transaction,
    });
    return secrets.map((secret) => secret.toDomain());
  }

  // SecretVersion Area
  async findVersionBySecretId(secretId: UniqueId, transaction?: any): Promise<SecretVersion | null> {
    const secretVersion = await SecretVersionModel.findOne({ where: { secretId: secretId.toString() }, transaction });
    return secretVersion ? secretVersion.toDomain() : null;
  }
}
