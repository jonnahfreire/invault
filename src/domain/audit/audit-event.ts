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
  constructor(
    readonly props: AuditEventProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

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

  get actorId() {
    return this.props.actorId;
  }
  get action() {
    return this.props.action;
  }
  get resourceId() {
    return this.props.resourceId;
  }
  get timestamp() {
    return this.props.timestamp;
  }
  get metadata() {
    return this.props.metadata;
  }
  get previousHash() {
    return this.props.previousHash;
  }
  get currentHash() {
    return this.props.currentHash;
  }
}
