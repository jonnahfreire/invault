import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, DeletedAt } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { ClientAccountStatus } from "@domain/identity/enum/client-account-status.enum";
import { ClientAccount } from "@domain/identity/client-account";
import UserModel from "./user.model";

@Table({ tableName: "client_accounts", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id", "user_id"] }] })
export default class ClientAccountModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, field: "user_id" })
  declare userId: string;

  @Column({ type: DataType.TEXT, field: "password_hash" })
  declare passwordHash: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN, field: "mfa_enabled", defaultValue: false })
  declare mfaEnabled: boolean;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ClientAccountStatus)) })
  declare status: ClientAccountStatus;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  toDomain(): ClientAccount {
    return new ClientAccount(
      {
        userId: UniqueId.create(this.userId),
        status: this.status,
        passwordHash: this.passwordHash,
        mfaEnabled: this.mfaEnabled,
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
