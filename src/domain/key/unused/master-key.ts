import { AggregateRoot } from "../../@common/aggregate-root";
import { UniqueId } from "../../@common/uniqueid";
import { KeyStatus } from "./key-status";
import { VaultKeyAlgorithm } from "../enum/vault-key-algorithm";

interface MasterKeyProps {
  algorithm: VaultKeyAlgorithm;
  status: KeyStatus;
  createdAt: Date;
  rotatedAt?: Date;
}

export class MasterKey extends AggregateRoot<MasterKeyProps> {
  private constructor(
    readonly props: MasterKeyProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(algorithm: VaultKeyAlgorithm): MasterKey {
    return new MasterKey({
      algorithm,
      status: KeyStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  public rotate() {
    if (this.props.status !== KeyStatus.ACTIVE) {
      throw new Error("Only active master keys can be rotated.");
    }

    this.props.status = KeyStatus.ROTATED;
    this.props.rotatedAt = new Date();
  }

  public revoke() {
    this.props.status = KeyStatus.REVOKED;
  }

  public get status() {
    return this.props.status;
  }
}
