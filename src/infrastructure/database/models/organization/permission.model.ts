import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo, ForeignKey } from "sequelize-typescript";
import RoleModel from "./role.model";
import { Permission } from "@domain/authorization/permission";
import { UniqueId } from "@domain/@common/uniqueid";

@Table({ tableName: "permission", timestamps: true, updatedAt: false, paranoid: true })
export default class PermissionModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @ForeignKey(() => RoleModel)
  declare roleId: string;

  @BelongsTo(() => RoleModel, "roleId")
  declare role: RoleModel;

  toDomain(): Permission {
    return new Permission(
      {
        resource: this.role.name,
        action: this.name,
        roleId: UniqueId.create(this.role.id),
      },
      UniqueId.create(this.id),
    );
  }
}
