import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";

interface OrganizationProps {
  name: string;
  parentId?: UniqueId;
  tenants?: Application[];
  createdAt: Date;
}

export class Organization extends AggregateRoot<OrganizationProps> {
  constructor(
    readonly props: OrganizationProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, parentId?: UniqueId) {
    return new Organization({
      name,
      parentId,
      createdAt: new Date(),
    });
  }

  public get parentId() {
    return this.props.parentId;
  }
}
