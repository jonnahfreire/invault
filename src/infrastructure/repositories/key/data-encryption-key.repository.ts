import { UniqueId } from "@domain/@common/uniqueid";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import { IDataEncryptionKeyRepository } from "@domain/key/data-encryption-key.repository";
import { Injectable } from "@nestjs/common";
import DataEncryptionKeyModel from "@infra/database/models/key/data-encryption-key.model";

@Injectable()
export default class DataEncryptionKeyRepository extends IDataEncryptionKeyRepository {
  async save(entity: DataEncryptionKey, transaction?: any): Promise<void> {
    await DataEncryptionKeyModel.create(
      {
        id: entity.id.toString(),
        keyId: entity.keyId.toString(),
        iv: entity.iv,
        tag: entity.tag,
        cipher: entity.cipher,
      },
      { transaction },
    );
  }

  async findById(id: UniqueId, transaction?: any): Promise<DataEncryptionKey | null> {
    const dekModel = await DataEncryptionKeyModel.findByPk(id.toString(), { transaction });
    if (!dekModel) return null;
    return dekModel.toDomain();
  }
}
