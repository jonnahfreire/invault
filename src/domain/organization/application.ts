import { Entity } from "@domain/@common/entity";
import { UniqueId } from "../@common/uniqueid";
import { Secret } from "@domain/secret/secret";

interface ApplicationProps {
  name: string;
  organizationId: UniqueId;
  createdAt: Date;
  secrets: Secret[];
}

export class Application extends Entity<ApplicationProps> {
  constructor(
    readonly props: ApplicationProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(name: string, organizationId: UniqueId) {
    return new Application({
      name,
      organizationId,
      secrets: [],
      createdAt: new Date(),
    });
  }

  public get organizationId() {
    return this.props.organizationId;
  }
}
