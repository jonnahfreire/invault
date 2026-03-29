import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { KeyEncryptionKey } from "@domain/key/key-encryption-key";

@Table({ tableName: "kek_metadata", timestamps: true, updatedAt: false, paranoid: true })
export default class KekMetadataModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
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
