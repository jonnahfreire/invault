import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, HasMany, UpdatedAt, BelongsToMany } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { Organization } from "@domain/organization/organization";
import { Application } from "@domain/organization/application";
import { OrganizationStatus } from "@domain/organization/enum/organization-status.enum";
import { User } from "@domain/identity/user";
import UserModel from "./user.model";
import ApplicationModel from "./application.model";
import MembershipModel from "./membership";

@Table({ tableName: "organization", timestamps: true, paranoid: true, indexes: [{ unique: true, fields: ["id"] }] })
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
        applications: this.applications.map(
          (app) =>
            new Application(
              {
                name: app.name,
                organizationId: UniqueId.create(app.organization.id),
                createdAt: app.createdAt,
                secrets: app.secrets.map((secret) => secret.toDomain()),
                serviceAccounts: app.serviceAccounts.map((account) => account.toDomain()),
              },
              UniqueId.create(app.id),
            ),
        ),
        users: this.users.map(
          (user) =>
            new User(
              {
                name: user.name,
                email: user.email,
                mfaEnabled: user.mfaEnabled,
                status: user.status,
                createdAt: user.createdAt,
              },
              UniqueId.create(user.id),
            ),
        ),
      },
      UniqueId.create(this.id),
    );
  }
}
