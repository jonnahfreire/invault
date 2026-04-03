import { Table, Model, ForeignKey, Column, DataType, BelongsTo } from "sequelize-typescript";
import MembershipModel from "./membership.model";
import RoleModel from "./role.model";

@Table({
  tableName: "membership_role",
  timestamps: false,
  paranoid: true,
  indexes: [{ unique: true, fields: ["role_id", "membership_id"] }],
})
export default class MembershipRoleModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, field: "role_id" })
  declare roleId: string;

  @ForeignKey(() => MembershipModel)
  @Column({ type: DataType.UUID, field: "membership_id" })
  declare membershipId: string;

  @BelongsTo(() => MembershipModel)
  declare membership: MembershipModel;

  @BelongsTo(() => RoleModel)
  declare role: RoleModel;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare active: boolean;
}
