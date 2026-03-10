import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { ServiceAccount, ServiceAccountStatus } from "@domain/identity/service-account";
import ApplicationModel from "./application.model";

@Table({ tableName: "service_account", timestamps: true, paranoid: true })
export default class ServiceAccountModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @ForeignKey(() => ApplicationModel)
  @Column({ type: DataType.UUID })
  declare applicationId: string;

  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare status: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  toDomain(): ServiceAccount {
    return new ServiceAccount(
      {
        name: this.name,
        applicationId: UniqueId.create(this.applicationId),
        status: this.status as ServiceAccountStatus,
        createdAt: this.createdAt,
      },
      UniqueId.create(this.id),
    );
  }
}
