import { AuditEvent } from "@domain/audit/audit-event";
import IAuditRepository from "@domain/audit/audit.repository";
import AuditEventModel from "@infra/database/models/audit/audit-event.model";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";

@Injectable()
export default class AuditRepository extends BaseRepository implements IAuditRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(event: AuditEvent): Promise<void> {
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
      { transaction: this.transaction },
    );
  }
}
