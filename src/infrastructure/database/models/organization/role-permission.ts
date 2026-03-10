import { Table, Model, ForeignKey, Column, DataType } from "sequelize-typescript";
import RoleModel from "./role.model";
import PermissionModel from "./permission.model";

@Table({
  tableName: "role_permission",
  timestamps: false,
  paranoid: true,
  indexes: [{ unique: true, fields: ["role_id", "permission_id"] }],
})
export default class RolePermissionModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, field: "role_id" })
  declare roleId: string;

  @ForeignKey(() => PermissionModel)
  @Column({ type: DataType.UUID, field: "permission_id" })
  declare permissionId: string;
}
