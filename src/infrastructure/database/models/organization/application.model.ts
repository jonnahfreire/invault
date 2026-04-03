import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo, UpdatedAt, HasMany, ForeignKey, DeletedAt } from "sequelize-typescript";
import OrganizationModel from "./organization.model";
import { Application } from "@domain/organization/application";
import { UniqueId } from "@domain/@common/uniqueid";
import ServiceAccountModel from "./service-account.model";

@Table({ tableName: "applications", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id", "organization_id"] }] })
export default class ApplicationModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  @ForeignKey(() => OrganizationModel)
  @Column({ type: DataType.UUID, field: "organization_id" })
  declare organizationId: string;

  @BelongsTo(() => OrganizationModel, "organizationId")
  declare organization: OrganizationModel;

  @HasMany(() => ServiceAccountModel)
  declare serviceAccounts: ServiceAccountModel[];

  toDomain(): Application {
    return new Application(
      {
        name: this.name,
        organizationId: UniqueId.create(this.organizationId),
        createdAt: this.createdAt,
        serviceAccounts: this.serviceAccounts ? this.serviceAccounts.map((account) => account.toDomain()) : [],
      },
      UniqueId.create(this.id),
    );
  }
}
