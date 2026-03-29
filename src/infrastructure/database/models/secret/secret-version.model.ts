import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo, ForeignKey } from "sequelize-typescript";
import { SecretVersion } from "@domain/secret/secret-version";
import { UniqueId } from "@domain/@common/uniqueid";
import SecretModel from "./secret.model";

@Table({
  tableName: "secret_version",
  timestamps: true,
  updatedAt: false,
  paranoid: true,
  indexes: [{ unique: true, fields: ["secret_id", "version"] }, { fields: ["secret_id", "created_at"] }],
})
export default class SecretVersionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => SecretModel)
  @Column({ type: DataType.UUID, field: "secret_id" })
  secretId: string;

  @Column({ type: DataType.UUID, field: "dek_id" })
  dekId: string;

  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare version: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  payload: string;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: "created_by" })
  declare createdBy?: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: "expires_at" })
  expiresAt?: Date;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @BelongsTo(() => SecretModel, "secretId")
  declare secret: SecretModel;

  toDomain(): SecretVersion {
    return new SecretVersion(
      {
        secretId: UniqueId.create(this.secretId),
        dekId: UniqueId.create(this.dekId),
        version: this.version,
        payload: this.payload,
        createdBy: this.createdBy ? UniqueId.create(this.createdBy) : undefined,
        createdAt: this.createdAt,
        expiresAt: this.expiresAt,
      },
      UniqueId.create(this.id),
    );
  }
}
