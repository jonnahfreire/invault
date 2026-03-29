import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, UpdatedAt, BelongsToMany } from "sequelize-typescript";
import { User } from "@domain/identity/user";
import { UniqueId } from "@domain/@common/uniqueid";
import { UserStatus } from "@domain/identity/enum/user-status.enum";
import OrganizationModel from "./organization.model";
import MembershipModel from "./membership";

@Table({ tableName: "user", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id"] }] })
export default class UserModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  declare email: string;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: "mfa_enabled", defaultValue: false })
  declare mfaEnabled: boolean;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(UserStatus)) })
  declare status: UserStatus;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @BelongsToMany(() => OrganizationModel, () => MembershipModel)
  declare organizations: OrganizationModel[];

  toDomain(): User {
    return new User(
      {
        name: this.name,
        email: this.email,
        mfaEnabled: this.mfaEnabled,
        status: this.status,
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
