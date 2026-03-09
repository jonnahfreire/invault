import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model, BelongsTo, HasMany } from "sequelize-typescript";
import { Secret, SecretStatus, SecretType } from "@domain/secret/secret";
import { UniqueId } from "@domain/@common/uniqueid";
import ApplicationModel from "../organization/application.model";
import SecretVersionModel from "./secret-version.model";

@Table({ tableName: "secret", timestamps: true, updatedAt: false, paranoid: true })
export default class SecretModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "application_id" })
  applicationId: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare type: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare status: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "created_by" })
  declare createdBy: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel;

  @HasMany(() => SecretVersionModel)
  declare versions: SecretVersionModel[];

  toDomain(): Secret {
    return new Secret(
      {
        name: this.name,
        type: this.type as SecretType,
        status: this.status as SecretStatus,
        applicationId: UniqueId.create(this.applicationId),
        createdAt: this.createdAt,
        createdBy: this.createdBy,
        versions: this.versions.map((version) => version.toDomain()),
      },
      UniqueId.create(this.id),
    );
  }
}
