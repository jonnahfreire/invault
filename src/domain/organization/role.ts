import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Permission } from "./permission";

interface RoleProps {
  name: string;
  organizationId?: UniqueId | null;
  parentRoleId?: UniqueId | null;
  permissions: Permission[];
}

export class Role extends AggregateRoot<RoleProps> {
  constructor(
    readonly props: RoleProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(data: RoleProps) {
    return new Role({
      name: data.name,
      organizationId: data.organizationId,
      parentRoleId: data.parentRoleId,
      permissions: [],
    });
  }

  public addPermission(permission: Permission) {
    if (!this.props.permissions.some((p) => p.equals(permission))) {
      this.props.permissions.push(permission);
    }
  }

  public get permissions() {
    return this.props.permissions;
  }

  public get generic() {
    return this.props.organizationId === null;
  }
}
