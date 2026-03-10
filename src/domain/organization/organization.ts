import { User } from "@domain/identity/user";
import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";

export enum OrganizationStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  ARCHIVED = "archived",
}

interface OrganizationProps {
  name: string;
  status: OrganizationStatus;
  applications?: Application[];
  users?: User[];
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
      status: OrganizationStatus.ACTIVE,
      applications: [],
      users: [],
      createdAt: new Date(),
    });
  }

  public suspend() {
    this.props.status = OrganizationStatus.SUSPENDED;
  }

  public archive() {
    this.props.status = OrganizationStatus.ARCHIVED;
  }
}
