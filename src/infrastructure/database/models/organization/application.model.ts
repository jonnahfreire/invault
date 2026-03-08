import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo, UpdatedAt, HasMany } from "sequelize-typescript";
import OrganizationModel from "./organization.model";
import SecretModel from "../secret/secret.model";

@Table({ tableName: "application", timestamps: true, paranoid: true })
export default class ApplicationModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
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

  @BelongsTo(() => OrganizationModel)
  declare organization: OrganizationModel;

  @HasMany(() => SecretModel)
  declare secrets: SecretModel[];
}
