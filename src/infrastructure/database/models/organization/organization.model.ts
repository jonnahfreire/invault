import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, HasMany, UpdatedAt } from "sequelize-typescript";
import UserModel from "./user.model";
import ApplicationModel from "./application.model";
import { UniqueId } from "@domain/@common/uniqueid";
import { Organization } from "@domain/organization/organization";
import { Application } from "@domain/organization/application";

@Table({ tableName: "organization", timestamps: true, paranoid: true })
export default class OrganizationModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING, field: "id" })
  declare id: string;

  @Column({ type: DataType.STRING, field: "name" })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;

  @HasMany(() => UserModel)
  declare users: UserModel[];

  @HasMany(() => ApplicationModel)
  declare applications: ApplicationModel[];

  toDomain(): Organization {
    const organizationId = this.id ? new UniqueId(this.id) : undefined;
    const tenants = this.applications.map((app) => {
      const tenantId = app.id ? new UniqueId(app.id) : undefined;
      return new Application({ name: app.name, organizationId: new UniqueId(app.organization.id), createdAt: app.createdAt }, tenantId);
    });

    return new Organization({ name: this.name, createdAt: this.createdAt, tenants }, organizationId);
  }
}
