import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import KekMetadataModel from "./kek-metadata.model";

@Table({ tableName: "data_encryption_key", timestamps: true, updatedAt: false, indexes: [{ unique: true, fields: ["id", "keyId"] }] })
export default class DataEncryptionKeyModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => KekMetadataModel)
  @Column({ type: DataType.UUID, field: "key_id" })
  declare keyId: string;

  @BelongsTo(() => KekMetadataModel, { foreignKey: "keyId", as: "kekMetadata" })
  declare kekMetadata: KekMetadataModel;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare iv: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare tag: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare cipher: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  toDomain(): DataEncryptionKey {
    return new DataEncryptionKey(
      {
        keyId: UniqueId.create(this.keyId),
        iv: this.iv,
        tag: this.tag,
        cipher: this.cipher,
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
