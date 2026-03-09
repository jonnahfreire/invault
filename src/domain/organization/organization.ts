import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";

interface OrganizationProps {
  name: string;
  applications?: Application[];
  createdAt: Date;
}

export class Organization extends AggregateRoot<OrganizationProps> {
  constructor(
    readonly props: OrganizationProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string) {
    return new Organization({
      name,
      createdAt: new Date(),
    });
  }
}
