import { Entity } from "@domain/@common/entity";
import { UniqueId } from "@domain/@common/uniqueid";
import { Role } from "@domain/organization/role";

interface MembershipProps {
  active: boolean;
  userId: UniqueId;
  organizationId: UniqueId;
  joinedAt?: Date;
  roles?: Role[];
}

export class Membership extends Entity<MembershipProps> {
  constructor(
    readonly props: MembershipProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(data: Omit<MembershipProps, "active">) {
    return new Membership({
      ...data,
      joinedAt: new Date(),
      active: true,
      roles: [],
    });
  }

  public get joindAt() {
    return this.props.joinedAt;
  }
}
