import { Table, PrimaryKey, Column, DataType, AllowNull, CreatedAt, Model } from "sequelize-typescript";
import { UniqueId } from "@domain/@common/uniqueid";
import { AuditEvent } from "@domain/audit/audit-event";

@Table({ tableName: "audit_events", timestamps: true, updatedAt: false, indexes: [{ unique: true, fields: ["id"] }] })
export default class AuditEventModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.UUID })
  declare actorId: string;

  @Column({ type: DataType.STRING })
  declare action: string;

  @Column({ type: DataType.UUID })
  declare resourceId: string;

  @Column({ type: DataType.DATE })
  declare timestamp: Date;

  @AllowNull(true)
  @Column({ type: DataType.JSON })
  declare metadata?: Record<string, unknown>;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare previousHash?: string;

  @Column({ type: DataType.STRING })
  declare currentHash: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: Date;

  toDomain(): AuditEvent {
    return new AuditEvent(
      {
        actorId: UniqueId.from(this.actorId),
        action: this.action,
        resourceId: UniqueId.from(this.resourceId),
        timestamp: this.timestamp,
        metadata: this.metadata,
        previousHash: this.previousHash,
        currentHash: this.currentHash,
      },
      UniqueId.from(this.id),
    );
  }
}
