import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo, UpdatedAt, HasMany, ForeignKey } from "sequelize-typescript";
import OrganizationModel from "./organization.model";
import SecretModel from "../secret/secret.model";
import { Application } from "@domain/organization/application";
import { UniqueId } from "@domain/@common/uniqueid";

@Table({ tableName: "application", timestamps: true, paranoid: true })
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

  @ForeignKey(() => OrganizationModel)
  declare organizationId: string;

  @BelongsTo(() => OrganizationModel, "organizationId")
  declare organization: OrganizationModel;

  @HasMany(() => SecretModel)
  declare secrets: SecretModel[];

  toDomain(): Application {
    return new Application(
      {
        name: this.name,
        organizationId: UniqueId.create(this.organizationId),
        createdAt: this.createdAt,
        secrets: this.secrets.map((secret) => secret.toDomain()),
      },
      UniqueId.create(this.id),
    );
  }
}
