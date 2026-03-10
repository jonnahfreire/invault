import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo, UpdatedAt, ForeignKey, BelongsToMany } from "sequelize-typescript";
import { Role } from "@domain/organization/role";
import { UniqueId } from "@domain/@common/uniqueid";
import OrganizationModel from "./organization.model";
import PermissionModel from "./permission.model";
import RolePermissionModel from "./role-permission";

@Table({ tableName: "role", timestamps: true, paranoid: true })
export default class RoleModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID })
  parentRoleId?: string;

  @BelongsTo(() => RoleModel, "parentRoleId")
  parentRole?: RoleModel;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID })
  organizationId?: string;

  @BelongsTo(() => OrganizationModel, "organizationId")
  declare organization: OrganizationModel;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  declare permissions: PermissionModel[];

  toDomain(): Role {
    return new Role(
      {
        name: this.name,
        organizationId: this.organizationId ? UniqueId.create(this.organizationId) : undefined,
        permissions: this.permissions.map((perm) => perm.toDomain()),
      },
      UniqueId.create(this.id),
    );
  }
}
