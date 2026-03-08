import { AuditEvent } from "../../domain/audit/audit-event";
import { UniqueId } from "../../domain/@common/uniqueid";

export class AuditService {
  private events: AuditEvent[] = [];

  async logEvent(actorId: UniqueId, action: string, resourceId: UniqueId, currentHash: string, previousHash?: string, metadata?: Record<string, unknown>): Promise<void> {
    const event = AuditEvent.create(actorId, action, resourceId, currentHash, previousHash, metadata);
    this.events.push(event);
    console.log(`Audit: ${action} on resource ${resourceId.toString()} by ${actorId.toString()}`);
    return new Promise(() => {});
  }

  getEvents(): AuditEvent[] {
    return this.events;
  }
}
