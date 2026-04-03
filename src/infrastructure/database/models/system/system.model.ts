import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "system", timestamps: true, indexes: [{ unique: true, fields: ["id", "name"] }] })
export default class SystemModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING })
  declare name: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: "updated_at" })
  declare updatedAt: Date;
}
