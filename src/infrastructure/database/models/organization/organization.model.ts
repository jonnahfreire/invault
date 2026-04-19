import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, HasMany, UpdatedAt, BelongsToMany, DeletedAt } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { Organization } from "@domain/organization/organization";
import { Application } from "@domain/application/application";
import { OrganizationStatus } from "@domain/organization/enum/organization-status.enum";
import UserModel from "./user.model";
import ApplicationModel from "./application.model";
import MembershipModel from "./membership.model";

@Table({ tableName: "organizations", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id"] }] })
export default class OrganizationModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.ENUM(...Object.values(OrganizationStatus)) })
  declare status: OrganizationStatus;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  @BelongsToMany(() => UserModel, () => MembershipModel)
  declare users: UserModel[];

  @HasMany(() => ApplicationModel)
  declare applications: ApplicationModel[];

  toDomain(): Organization {
    return new Organization(
      {
        name: this.name,
        status: this.status,
        createdAt: this.createdAt,
        applications: this.applications
          ? this.applications.map(
              (app) =>
                new Application(
                  {
                    name: app.name,
                    organizationId: UniqueId.from(app.organization.id),
                    createdAt: app.createdAt,
                    serviceAccounts: app.serviceAccounts ? app.serviceAccounts.map((account) => account.toDomain()) : [],
                  },
                  UniqueId.from(app.id),
                ),
            )
          : [],
        users: [],
      },
      UniqueId.from(this.id),
    );
  }
}
