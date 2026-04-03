import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, HasMany, DeletedAt } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretStatus } from "@domain/secret/enum/secret-status.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { Secret } from "@domain/secret/secret";
import SecretVersionModel from "./secret-version.model";

@Table({
  tableName: "secrets",
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
  declare ownerId: string;

  @AllowNull(true)
  @Column({ type: DataType.UUID, field: "current_version_id" })
  declare currentVersionId: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(SecretOwner)), field: "owner_type" })
  declare ownerType: SecretOwner;

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

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  @HasMany(() => SecretVersionModel, { foreignKey: "secret_id", as: "versions" })
  declare versions: SecretVersionModel[];

  toDomain(): Secret {
    return new Secret(
      {
        name: this.name,
        type: this.type as SecretType,
        status: this.status,
        ownerId: UniqueId.create(this.ownerId),
        ownerType: this.ownerType,
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        versions: this.versions ? this.versions.map((version) => version.toDomain()) : [],
        currentVersionId: this.currentVersionId ? UniqueId.create(this.currentVersionId) : null,
      },
      UniqueId.create(this.id),
    );
  }
}
