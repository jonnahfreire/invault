import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo } from "sequelize-typescript";
import { SecretVersion } from "@domain/secret/secret-version";
import { UniqueId } from "@domain/@common/uniqueid";
import OrganizationModel from "../organization/organization.model";

@Table({ tableName: "secret_version", timestamps: true, updatedAt: false, paranoid: true })
export default class SecretVersionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.UUID, field: "secret_id" })
  secretId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.NUMBER })
  declare version: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT, field: "payload" })
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

  @BelongsTo(() => OrganizationModel)
  declare organization: OrganizationModel;

  toDomain(): SecretVersion {
    return new SecretVersion(
      {
        secretId: UniqueId.create(this.secretId),
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
