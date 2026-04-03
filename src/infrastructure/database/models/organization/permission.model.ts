import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsToMany, DeletedAt } from "sequelize-typescript";
import RoleModel from "./role.model";
import { Permission } from "@domain/organization/permission";
import { UniqueId } from "@domain/@common/uniqueid";
import RolePermissionModel from "./role-permission.model";

@Table({
  tableName: "permissions",
  timestamps: true,
  paranoid: true,
  updatedAt: false,
  indexes: [{ unique: true, fields: ["id"] }],
})
export default class PermissionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare resource: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare action: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  @BelongsToMany(() => RoleModel, () => RolePermissionModel)
  declare role: RoleModel;

  toDomain(): Permission {
    return new Permission(
      {
        resource: this.resource,
        action: this.action,
      },
      UniqueId.create(this.id),
    );
  }
}
