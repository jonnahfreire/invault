import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, DeletedAt } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { ServiceAccount } from "@domain/identity/service-account";
import { ServiceAccountStatus } from "@domain/identity/enum/service-account-status.enum";
import ApplicationModel from "./application.model";

@Table({ tableName: "service_accounts", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id", "application_id"] }] })
export default class ServiceAccountModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @ForeignKey(() => ApplicationModel)
  @Column({ type: DataType.UUID, field: "application_id" })
  declare applicationId: string;

  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel;

  @AllowNull(false)
  @Column({ type: DataType.ENUM(...Object.values(ServiceAccountStatus)) })
  declare status: ServiceAccountStatus;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  toDomain(): ServiceAccount {
    return new ServiceAccount(
      {
        name: this.name,
        applicationId: UniqueId.create(this.applicationId),
        status: this.status,
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
