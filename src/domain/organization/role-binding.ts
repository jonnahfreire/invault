import { Entity } from "@domain/@common/entity";
import { UniqueId } from "../@common/uniqueid";
import { Scope } from "./scope";

enum RoleBindingSubject {
  USER = "user",
  SERVICE_ACCOUNT = "service-account",
}

interface RoleBindingProps {
  roleId: UniqueId;
  organizationId: UniqueId;
  subjectType: RoleBindingSubject;
  subjectId: UniqueId;
  scope: Scope;
  createdAt: Date;
}

export class RoleBinding extends Entity<RoleBindingProps> {
  constructor(
    readonly props: RoleBindingProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(data: RoleBindingProps) {
    if (!data.scope) throw new Error("Scope must not be null or empty");

    return new RoleBinding({
      roleId: data.roleId,
      organizationId: data.organizationId,
      subjectType: data.subjectType,
      subjectId: data.subjectId,
      scope: data.scope,
      createdAt: new Date(),
    });
  }
}
