import { AuditEvent } from "@domain/audit/audit-event";
import IAuditRepository, { AuditQueryFilters, AuditQueryResult } from "@domain/audit/audit.repository";
import AuditEventModel from "@infra/database/models/audit/audit-event.model";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { Op, WhereOptions } from "sequelize";

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

  async query(filters: AuditQueryFilters): Promise<AuditQueryResult> {
    const where: WhereOptions = {};

    if (filters.actorId) where.actorId = filters.actorId.toString();
    if (filters.action) where.action = filters.action;
    if (filters.resourceIds && filters.resourceIds.length > 0) {
      where.resourceId = { [Op.in]: filters.resourceIds.map((id) => id.toString()) };
    } else if (filters.resourceId) {
      where.resourceId = filters.resourceId.toString();
    }

    if (filters.startDate && filters.endDate) {
      where.timestamp = { [Op.between]: [filters.startDate, filters.endDate] };
    } else if (filters.startDate) {
      where.timestamp = { [Op.gte]: filters.startDate };
    } else if (filters.endDate) {
      where.timestamp = { [Op.lte]: filters.endDate };
    }

    const offset = (filters.page - 1) * filters.pageSize;

    const { rows, count } = await AuditEventModel.findAndCountAll({
      where,
      order: [["timestamp", "DESC"]],
      limit: filters.pageSize,
      offset,
      transaction: this.transaction,
    });

    return {
      items: rows.map((row) => row.toDomain()),
      total: count,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }
}
