import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, ForeignKey } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { DataEncryptionKey } from "@domain/key/data-encryption-key";
import KekMetadataModel from "./kek-metadata.model";

@Table({ tableName: "dek", timestamps: true, updatedAt: false, paranoid: true })
export default class DekModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  declare id: string;

  @ForeignKey(() => KekMetadataModel)
  @Column({ type: DataType.STRING(36) })
  declare keyId: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  iv: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare tag: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare cipher: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare version: number;

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
      },
      UniqueId.create(this.id),
    );
  }
}
