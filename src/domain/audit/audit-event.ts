import { Entity } from "../@common/entity";
import { UniqueId } from "../@common/uniqueid";

interface AuditEventProps {
  actorId: UniqueId;
  action: string;
  resourceId: UniqueId;
  timestamp: Date;
  metadata?: Record<string, unknown>;
  previousHash?: string;
  currentHash: string;
}

export class AuditEvent extends Entity<AuditEventProps> {
  public static create(actorId: UniqueId, action: string, resourceId: UniqueId, currentHash: string, previousHash?: string, metadata?: Record<string, unknown>) {
    return new AuditEvent({
      actorId,
      action,
      resourceId,
      timestamp: new Date(),
      metadata,
      previousHash,
      currentHash,
    });
  }
}
