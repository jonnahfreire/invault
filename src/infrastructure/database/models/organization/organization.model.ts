import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, HasMany, UpdatedAt, BelongsToMany } from "sequelize-typescript";
import UserModel from "./user.model";
import ApplicationModel from "./application.model";
import { UniqueId } from "@domain/@common/uniqueid";
import { Organization } from "@domain/organization/organization";
import { Application } from "@domain/organization/application";
import MembershipModel from "./membership";

@Table({ tableName: "organization", timestamps: true, paranoid: true })
export default class OrganizationModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, field: "id" })
  declare id: string;

  @Column({ type: DataType.STRING, field: "name" })
  declare name: string;

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
    const apps = this.applications.map(
      (app) =>
        new Application(
          {
            name: app.name,
            organizationId: UniqueId.create(app.organization.id),
            createdAt: app.createdAt,
            secrets: app.secrets.map((secret) => secret.toDomain()),
          },
          UniqueId.create(app.id),
        ),
    );
    return new Organization({ name: this.name, createdAt: this.createdAt, applications: apps }, UniqueId.create(this.id));
  }
}
