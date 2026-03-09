import { UniqueId } from "@domain/@common/uniqueid";
import { Entity } from "../@common/entity";

export enum ResourceType {
  SECRET = "secret",
  TENANT = "tenant",
  ROLE = "role",
  USER = "user",
}

export enum Action {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ROTATE = "rotate",
  GRANT = "grant",
}

interface PermissionProps {
  roleId: UniqueId;
  resource: ResourceType | string;
  action: Action | string;
}

export class Permission extends Entity<PermissionProps> {
  constructor(
    readonly props: PermissionProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(data: PermissionProps) {
    return new Permission(data);
  }

  public equals(permission: Permission): boolean {
    return this.props.resource === permission.props.resource && this.props.action === permission.props.action;
  }
}
