import { IRepository } from "@domain/@common/repository";
import { AuditEvent } from "./audit-event";
import { UniqueId } from "@domain/@common/uniqueid";

export interface AuditQueryFilters {
  actorId?: UniqueId;
  action?: string;
  resourceId?: UniqueId;
  resourceIds?: UniqueId[];
  startDate?: Date;
  endDate?: Date;
  page: number;
  pageSize: number;
}

export interface AuditQueryResult {
  items: AuditEvent[];
  total: number;
  page: number;
  pageSize: number;
}

export default abstract class IAuditRepository implements Pick<IRepository<AuditEvent>, "save"> {
  abstract save(entity: AuditEvent): Promise<void>;
  abstract query(filters: AuditQueryFilters): Promise<AuditQueryResult>;
}
