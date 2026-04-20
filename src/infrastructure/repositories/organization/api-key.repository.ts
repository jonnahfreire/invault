import { UniqueId } from "@domain/@common/uniqueid";
import { ApiKey } from "@domain/application/api-key";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import ApiKeyModel from "@infra/database/models/organization/api-key.model";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";

@Injectable()
export default class ApiKeyRepository extends BaseRepository implements IApiKeyRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(entity: ApiKey): Promise<void> {
    await ApiKeyModel.upsert(
      {
        id: entity.id.toString(),
        applicationId: entity.applicationId.toString(),
        name: entity.name,
        keyHash: entity.keyHash,
        active: entity.active,
        expiresAt: entity.expiresAt,
      },
      { transaction: this.transaction },
    );
  }

  async findById(id: UniqueId): Promise<ApiKey | null> {
    const row = await ApiKeyModel.findByPk(id.toString(), { transaction: this.transaction });
    return row ? row.toDomain() : null;
  }

  async findByHash(keyHash: string): Promise<ApiKey | null> {
    const row = await ApiKeyModel.findOne({ where: { keyHash, active: true }, transaction: this.transaction });
    return row ? row.toDomain() : null;
  }

  async findByApplicationId(applicationId: UniqueId): Promise<ApiKey[]> {
    const rows = await ApiKeyModel.findAll({ where: { applicationId: applicationId.toString() }, transaction: this.transaction });
    return rows.map((r) => r.toDomain());
  }

  async delete(id: UniqueId): Promise<void> {
    await ApiKeyModel.destroy({ where: { id: id.toString() }, transaction: this.transaction });
  }
}
