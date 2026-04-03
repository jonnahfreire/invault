import { AuditEvent } from "../../domain/audit/audit-event";
import { UniqueId } from "../../domain/@common/uniqueid";
import { Injectable } from "@nestjs/common";
import IAuditRepository from "@domain/audit/audit.repository";

@Injectable()
export class AuditService {
  constructor(private readonly auditRepsoitory: IAuditRepository) {}

  async logEvent(actorId: UniqueId, action: string, resourceId: UniqueId, currentHash: string, previousHash?: string, metadata?: Record<string, unknown>): Promise<void> {
    const event = AuditEvent.create(actorId, action, resourceId, currentHash, previousHash, metadata);
    return await this.auditRepsoitory.save(event);
  }
}
