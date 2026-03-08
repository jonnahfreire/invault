import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo, HasMany } from "sequelize-typescript";
import ApplicationModel from "../organization/application.model";
import SecretVersionModel from "./secret-version.model";
import { Secret, SecretStatus, SecretType } from "@domain/secret/secret";
import { UniqueId } from "@domain/@common/uniqueid";
import { SecretVersion } from "@domain/secret/secret-version";

@Table({ tableName: "secret", timestamps: true, updatedAt: false, paranoid: true })
export default class SecretModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "tenant_id" })
  tenantId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "owner_role_id" })
  ownerRoleId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare type: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200), field: "engine_type" })
  declare engineType: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare status: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "created_by" })
  declare createdBy: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel;

  @HasMany(() => SecretVersionModel)
  declare versions: SecretVersionModel[];

  toDomain(): Secret {
    const secretId = this.id ? new UniqueId(this.id) : undefined;
    const secretVersions = this.versions.map((version) => {
      const versionId = version.id ? new UniqueId(version.id) : undefined;
      return new SecretVersion(
        {
          secretId: new UniqueId(version.secretId),
          version: version.version,
          encryptedPayload: version.encryptedPayload,
          createdBy: new UniqueId(version.createdBy),
          createdAt: version.createdAt,
          expiresAt: version.expiresAt,
        },
        versionId,
      );
    });
    return new Secret(
      {
        name: this.name,
        type: this.type as SecretType,
        status: this.status as SecretStatus,
        engineType: this.engineType,
        tenantId: this.tenantId,
        ownerRoleId: this.ownerRoleId,
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        versions: secretVersions,
      },
      secretId,
    );
  }
}
