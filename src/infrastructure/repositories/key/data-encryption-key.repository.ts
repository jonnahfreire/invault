import { UniqueId } from "@domain/@common/uniqueid";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { Injectable } from "@nestjs/common";
import DataEncryptionKeyModel from "@infra/database/models/key/data-encryption-key.model";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";

@Injectable()
export default class DataEncryptionKeyRepository extends BaseRepository implements IDataEncryptionKeyRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(entity: DataEncryptionKey): Promise<void> {
    await DataEncryptionKeyModel.upsert(
      {
        id: entity.id.toString(),
        iv: entity.iv,
        tag: entity.tag,
        cipher: entity.cipher,
        kekVersion: entity.kekVersion,
      },
      { transaction: this.transaction },
    );
  }

  async findById(id: UniqueId): Promise<DataEncryptionKey | null> {
    const dekModel = await DataEncryptionKeyModel.findByPk(id.toString(), { transaction: this.transaction });
    if (!dekModel) return null;
    return dekModel.toDomain();
  }
}
