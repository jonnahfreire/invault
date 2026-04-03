import { User } from "@domain/identity/user";
import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";
import { Application } from "./application";
import { OrganizationStatus } from "./enum/organization-status.enum";
import CreateOrganizationException from "./exceptions/organization.exception";

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
    if (!name || !name.length) throw new CreateOrganizationException("Organization name must not be null or empty");

    return new Organization({
      name,
      status: OrganizationStatus.ACTIVE,
      applications: [],
      users: [],
      createdAt: new Date(),
    });
  }

  public activate() {
    this.props.status = OrganizationStatus.ACTIVE;
  }

  public suspend() {
    this.props.status = OrganizationStatus.SUSPENDED;
  }

  public archive() {
    this.props.status = OrganizationStatus.ARCHIVED;
  }
}
