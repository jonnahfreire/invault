import { Table, Column, Model, DataType, PrimaryKey, AllowNull, CreatedAt, BelongsTo } from "sequelize-typescript";
import Organization from "./organization.model";

@Table({ tableName: "user", timestamps: false })
export default class User extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING(36) })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200) })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare created_at: Date;

  @BelongsTo(() => Organization)
  declare organization: Organization;

}
