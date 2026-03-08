import { AggregateRoot } from "../@common/aggregate-root";
import { UniqueId } from "../@common/uniqueid";

export enum ServiceAccountStatus {
  ACTIVE = "active",
  REVOKED = "revoked",
}

interface ServiceAccountProps {
  name: string;
  tenantId: UniqueId;
  publicKey: string;
  status: ServiceAccountStatus;
  createdAt: Date;
}

export class ServiceAccount extends AggregateRoot<ServiceAccountProps> {
  private constructor(readonly props: ServiceAccountProps, id?: UniqueId) {
    super(props, id);
  }

  public static create(
    name: string,
    tenantId: UniqueId,
    publicKey: string,
  ) {
    return new ServiceAccount({
      name,
      tenantId,
      publicKey,
      status: ServiceAccountStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  public revoke() {
    this.props.status = ServiceAccountStatus.REVOKED;
  }

  public isActive() {
    return this.props.status === ServiceAccountStatus.ACTIVE;
  }

  public isRevoked() {
    return this.props.status === ServiceAccountStatus.REVOKED;
  }
}
