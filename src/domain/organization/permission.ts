import { UniqueId } from "@domain/@common/uniqueid";
import { Entity } from "../@common/entity";

export enum ResourceType {
  SYSTEM = "system",
  ORGANIZATION = "organization",
  SECRET = "secret",
  APPLICATION = "application",
  ROLE = "role",
  USER = "user",
}

export enum Action {
  READ = "read",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  ROTATE = "rotate",
  GRANT = "grant",
}

interface PermissionProps {
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

  public organizationOwnerDefaults() {
    return [
      Permission.create({ action: Action.READ, resource: "organization" }),
      Permission.create({ action: Action.CREATE, resource: "organization" }),
      Permission.create({ action: Action.UPDATE, resource: "organization" }),
      Permission.create({ action: Action.DELETE, resource: "organization" }),
    ];
  }
}
