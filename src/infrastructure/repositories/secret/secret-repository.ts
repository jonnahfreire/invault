import { UniqueId } from "@domain/@common/uniqueid";
import { Secret } from "../../../domain/secret/secret";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";
import SecretModel from "@infra/database/models/secret/secret.model";
import SecretVersionModel from "@infra/database/models/secret/secret-version.model";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";

@Injectable()
export default class SecretRepository extends BaseRepository implements ISecretRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }
  async save(entity: Secret): Promise<void> {
    await SecretModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.name,
        type: entity.type,
        ownerId: entity.ownerId.toString(),
        ownerType: entity.ownerType,
        status: entity.status,
        createdBy: entity.createdBy,
      },
      { transaction: this.transaction },
    );

    for (const version of entity.versions) {
      await SecretVersionModel.upsert(
        {
          id: version.id.toString(),
          secretId: version.secretId.toString(),
          dekId: version.dekId.toString(),
          payload: version.payload,
          version: version.version,
          createdBy: version.createdBy?.toString(),
          expiresAt: version.expiresAt,
        },
        { transaction: this.transaction },
      );
    }

    await SecretModel.update({ currentVersionId: entity.currentVersionId?.toString() }, { where: { id: entity.id.toString() }, transaction: this.transaction });
  }

  async findByName(name: string): Promise<Secret | null> {
    const secret = await SecretModel.findOne({
      where: { name },
      include: [{ model: SecretVersionModel, as: "versions" }],
      transaction: this.transaction,
    });

    return secret ? secret.toDomain() : null;
  }

  async findById(id: UniqueId): Promise<Secret | null> {
    const secret = await SecretModel.findByPk(id.toString(), {
      include: [{ model: SecretVersionModel, as: "versions" }],
      transaction: this.transaction,
    });

    return secret ? secret.toDomain() : null;
  }

  async findOneByOwnerId(ownerId: UniqueId): Promise<Secret | null> {
    const secret = await SecretModel.findOne({
      where: { ownerId: ownerId.toString() },
      include: [{ model: SecretVersionModel, as: "versions" }],
      transaction: this.transaction,
    });
    return secret ? secret.toDomain() : null;
  }

  async findAllByOwnerId(ownerId: UniqueId): Promise<Secret[]> {
    const secrets = await SecretModel.findAll({
      where: { ownerId: ownerId.toString() },
      include: [{ model: SecretVersionModel, as: "versions" }],
      transaction: this.transaction,
    });
    return secrets.map((secret) => secret.toDomain());
  }

  async delete(id: UniqueId): Promise<void> {
    await SecretModel.destroy({ where: { id: id.toString() }, transaction: this.transaction });
  }
}
