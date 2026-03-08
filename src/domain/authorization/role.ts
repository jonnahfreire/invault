import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Permission } from "./permission";

interface RoleProps {
  name: string;
  organizationId: UniqueId;
  parentRoleId?: UniqueId;
  permissions: Permission[];
}

export class Role extends AggregateRoot<RoleProps> {
  private constructor(
    readonly props: RoleProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, organizationId: UniqueId, parentRoleId?: UniqueId) {
    return new Role({
      name,
      organizationId,
      parentRoleId,
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
}
