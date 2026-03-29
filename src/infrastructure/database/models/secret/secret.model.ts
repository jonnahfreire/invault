import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretStatus } from "@domain/secret/enum/secret-status.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { Secret } from "@domain/secret/secret";
import SecretVersionModel from "./secret-version.model";

@Table({
  tableName: "secret",
  timestamps: true,
  updatedAt: false,
  paranoid: true,
})
export default class SecretModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "owner_id" })
  ownerId: string;

  @AllowNull(true)
  @ForeignKey(() => SecretVersionModel)
  @Column({ type: DataType.UUID, field: "current_version_id" })
  currentVersionId: string | null;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SecretOwner)), field: "owner_type" })
  ownerType: SecretOwner;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare type: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SecretStatus)), field: "status" })
  declare status: SecretStatus;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: "created_by" })
  declare createdBy: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @HasMany(() => SecretVersionModel, { foreignKey: "secretId", as: "versions" })
  declare versions: SecretVersionModel[];

  @BelongsTo(() => SecretVersionModel, { foreignKey: "currentVersionId", as: "currentVersion" })
  declare currentVersion: SecretVersionModel;

  toDomain(): Secret {
    return new Secret(
      {
        name: this.name,
        type: this.type as SecretType,
        status: this.status,
        ownerId: UniqueId.create(this.ownerId),
        currentVersionId: this.currentVersionId ? UniqueId.create(this.currentVersionId) : undefined,
        ownerType: this.ownerType,
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        versions: this.versions.map((version) => version.toDomain()),
      },
      UniqueId.create(this.id),
    );
  }
}
