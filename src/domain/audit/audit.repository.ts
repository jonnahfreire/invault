import { IRepository } from "@domain/@common/repository";
import { AuditEvent } from "./audit-event";

export default abstract class IAuditRepository implements Pick<IRepository<AuditEvent>, "save"> {
  abstract save(entity: AuditEvent, transaction?: any): Promise<void>;
}
