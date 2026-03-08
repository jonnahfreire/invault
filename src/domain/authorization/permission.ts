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
  resource: ResourceType;
  action: Action;
}

export class Permission extends Entity<PermissionProps> {
  public static create(resource: ResourceType, action: Action) {
    return new Permission({ resource, action });
  }

  public equals(permission: Permission): boolean {
    return this.props.resource === permission.props.resource && this.props.action === permission.props.action;
  }
}
