import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, AutoIncrement, HasMany } from "sequelize-typescript";
import User from "./user.model";

@Table({ tableName: "organization", timestamps: false })
export default class Organization extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT, field: "id" })
  declare id: number;

  @Column({ type: DataType.STRING, field: "name" })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare created_at: Date;

  @HasMany(() => User)
  declare users: User[];
}
