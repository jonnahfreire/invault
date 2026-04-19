import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo, ForeignKey } from "sequelize-typescript";
import { SecretVersion } from "@domain/secret/secret-version";
import { UniqueId } from "@domain/@common/uniqueid";
import SecretModel from "./secret.model";
import DataEncryptionKeyModel from "../key/data-encryption-key.model";

@Table({
  tableName: "secret_versions",
  timestamps: true,
  updatedAt: false,
  deletedAt: false,
  indexes: [{ unique: true, fields: ["secret_id", "version"] }, { fields: ["secret_id", "created_at"] }],
})
export default class SecretVersionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => SecretModel)
  @Column({ type: DataType.UUID, field: "secret_id" })
  declare secretId: string;

  @ForeignKey(() => DataEncryptionKeyModel)
  @Column({ type: DataType.UUID, field: "dek_id" })
  declare dekId: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare version: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare payload: string;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: "created_by" })
  declare createdBy?: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: "expires_at" })
  declare expiresAt?: Date;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @BelongsTo(() => SecretModel, { foreignKey: "secret_id" })
  declare secret: SecretModel;

  @BelongsTo(() => DataEncryptionKeyModel, { foreignKey: "dek_id" })
  declare dek: DataEncryptionKeyModel;

  toDomain(): SecretVersion {
    return new SecretVersion(
      {
        secretId: UniqueId.from(this.secretId),
        dekId: UniqueId.from(this.dekId),
        version: this.version,
        payload: this.payload,
        createdBy: this.createdBy ? UniqueId.from(this.createdBy) : undefined,
        createdAt: this.createdAt,
        expiresAt: this.expiresAt,
      },
      UniqueId.from(this.id),
    );
  }
}
