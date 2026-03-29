import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsToMany } from "sequelize-typescript";
import RoleModel from "./role.model";
import { Permission } from "@domain/organization/permission";
import { UniqueId } from "@domain/@common/uniqueid";
import RolePermissionModel from "./role-permission";

@Table({ tableName: "permission", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id"] }] })
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
