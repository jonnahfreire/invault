import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo } from "sequelize-typescript";
import OrganizationModel from "../organization/organization.model";
import { SecretVersion } from "@domain/secret/secret-version";
import { UniqueId } from "@domain/@common/uniqueid";

@Table({ tableName: "secret_version", timestamps: true, updatedAt: false, paranoid: true })
export default class SecretVersionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  declare id: string;

  @Column({ type: DataType.STRING(36), field: "secret_id" })
  secretId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.NUMBER })
  declare version: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT, field: "payload" })
  encryptedPayload: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "created_by" })
  declare createdBy: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: "expires_at" })
  expiresAt?: Date;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @BelongsTo(() => OrganizationModel)
  declare organization: OrganizationModel;

  toDomain(): SecretVersion {
    const versionId = this.id ? new UniqueId(this.id) : undefined;
    return new SecretVersion(
      {
        secretId: new UniqueId(this.secretId),
        version: this.version,
        encryptedPayload: this.encryptedPayload,
        createdBy: new UniqueId(this.createdBy),
        createdAt: this.createdAt,
        expiresAt: this.expiresAt,
      },
      versionId,
    );
  }
}
