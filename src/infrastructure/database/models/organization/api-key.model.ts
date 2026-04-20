import { Table, Column, Model, DataType, PrimaryKey, AllowNull, ForeignKey, BelongsTo, CreatedAt, DeletedAt } from "sequelize-typescript";
import ApplicationModel from "./application.model";
import { UniqueId } from "@domain/@common/uniqueid";
import { ApiKey } from "@domain/application/api-key";

@Table({
  tableName: "api_keys",
  timestamps: true,
  paranoid: true,
  updatedAt: false,
  indexes: [{ unique: true, fields: ["id"] }, { fields: ["key_hash"] }],
})
export default class ApiKeyModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => ApplicationModel)
  @Column({ type: DataType.UUID, field: "application_id" })
  declare applicationId: string;

  @BelongsTo(() => ApplicationModel, "applicationId")
  declare application: ApplicationModel;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(64), field: "key_hash" })
  declare keyHash: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare active: boolean;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @Column({ type: DataType.DATE, field: "expires_at", allowNull: true })
  declare expiresAt?: Date;

  @DeletedAt
  @Column({ type: DataType.DATE, field: "deleted_at" })
  declare deletedAt: Date;

  toDomain(): ApiKey {
    return new ApiKey(
      {
        name: this.name,
        applicationId: UniqueId.from(this.applicationId),
        keyHash: this.keyHash,
        active: this.active,
        createdAt: this.createdAt,
        expiresAt: this.expiresAt,
      },
      UniqueId.from(this.id),
    );
  }
}
