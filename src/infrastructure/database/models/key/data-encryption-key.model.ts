import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import SecretVersionModel from "../secret/secret-version.model";

@Table({ tableName: "data_encryption_keys", timestamps: true, updatedAt: false, indexes: [{ unique: true, fields: ["id"] }] })
export default class DataEncryptionKeyModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.INTEGER, field: "kek_version" })
  declare kekVersion: number;

  @BelongsTo(() => SecretVersionModel, { foreignKey: "id", as: "secretVersion" })
  declare secretVersion: SecretVersionModel;

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
        kekVersion: this.kekVersion,
        iv: this.iv,
        tag: this.tag,
        cipher: this.cipher,
        createdAt: this.createdAt,
      },
      UniqueId.from(this.id),
    );
  }
}
