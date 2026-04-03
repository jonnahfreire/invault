import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, HasMany } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";
import DataEncryptionKeyModel from "./data-encryption-key.model";

@Table({ tableName: "kek_metadata", timestamps: true, updatedAt: false, indexes: [{ unique: true, fields: ["id"] }] })
export default class KekMetadataModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  salt: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare type: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  declare env: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare version: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @HasMany(() => DataEncryptionKeyModel, { foreignKey: "keyId", as: "deks" })
  declare deks: DataEncryptionKeyModel[];

  toDomain(): KeyEncryptionKey {
    return new KeyEncryptionKey(
      {
        salt: this.salt,
        type: this.type,
        env: this.env,
        createdAt: this.createdAt,
        version: this.version,
      },
      UniqueId.create(this.id),
    );
  }
}
