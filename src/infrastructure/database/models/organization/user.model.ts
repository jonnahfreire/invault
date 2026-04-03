import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, UpdatedAt, BelongsToMany, DeletedAt, HasOne } from "sequelize-typescript";
import { User } from "@domain/identity/user";
import { UniqueId } from "@domain/@common/uniqueid";
import { UserStatus } from "@domain/identity/enum/user-status.enum";
import OrganizationModel from "./organization.model";
import MembershipModel from "./membership.model";
import ClientAccountModel from "./client-account.model";

@Table({ tableName: "users", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id", "email"] }] })
export default class UserModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(100), unique: true })
  declare email: string;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(UserStatus)) })
  declare status: UserStatus;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  @BelongsToMany(() => OrganizationModel, () => MembershipModel)
  declare organizations: OrganizationModel[];

  @HasOne(() => ClientAccountModel, "user_id")
  declare account: ClientAccountModel;

  toDomain(): User {
    return new User(
      {
        name: this.name,
        email: this.email,
        status: this.status,
        account: this.account.toDomain(),
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
