import { Table, Model, ForeignKey, Column, DataType, CreatedAt, UpdatedAt, PrimaryKey, BelongsToMany, BelongsTo } from "sequelize-typescript";
import OrganizationModel from "./organization.model";
import UserModel from "./user.model";
import MembershipRoleModel from "./membership-role";
import RoleModel from "./role.model";
import { UniqueId } from "@domain/@common/uniqueid";
import { Membership } from "@domain/organization/membership";

@Table({
  tableName: "membership",
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  indexes: [{ unique: true, fields: ["id"] }],
})
export default class MembershipModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @BelongsTo(() => UserModel, "userId")
  declare user: UserModel;

  @ForeignKey(() => OrganizationModel)
  @Column({ type: DataType.UUID })
  declare organizationId: string;

  @BelongsTo(() => OrganizationModel, "organizationId")
  declare organization: OrganizationModel;

  @BelongsToMany(() => RoleModel, () => MembershipRoleModel)
  declare roles: RoleModel[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare active: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "joined_at" })
  declare joinedAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt?: Date;

  toDomain(): Membership {
    return new Membership(
      {
        active: this.active,
        userId: UniqueId.create(this.userId),
        organizationId: UniqueId.create(this.organizationId),
        joinedAt: this.joinedAt,
        roles: this.roles.map((role) => role.toDomain()),
      },
      UniqueId.create(this.id),
    );
  }
}
