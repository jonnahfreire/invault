import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, Default } from "sequelize-typescript";

@Table({ tableName: "idempotency_keys", timestamps: false })
export default class IdempotencyKey extends Model<IdempotencyKey> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(200), field: "idempotency_key" })
  idempotency_key!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50), field: "partner_id" })
  partner_id!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(64), field: "request_hash" })
  request_hash!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  status!: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, field: "response_body" })
  response_body?: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(36), field: "correlation_id" })
  correlation_id!: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: "created_at" })
  created_at!: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: "updated_at" })
  updated_at?: Date;
}
