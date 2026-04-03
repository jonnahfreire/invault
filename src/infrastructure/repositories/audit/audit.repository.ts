import { AuditEvent } from "@domain/audit/audit-event";
import IAuditRepository from "@domain/audit/audit.repository";
import AuditEventModel from "@infra/database/models/audit/audit-event.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class AuditRepository implements IAuditRepository {
  async save(event: AuditEvent, transaction?: any): Promise<void> {
    await AuditEventModel.create(
      {
        id: event.id.toString(),
        actorId: event.actorId.toString(),
        action: event.action,
        resourceId: event.resourceId.toString(),
        timestamp: event.timestamp,
        metadata: event.metadata,
        previousHash: event.previousHash,
        currentHash: event.currentHash,
      },
      transaction,
    );
  }
}
