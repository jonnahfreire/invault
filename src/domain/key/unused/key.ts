import { AggregateRoot } from "../../@common/aggregate-root";
import { UniqueId } from "../../@common/uniqueid";
import { KeyMaterial } from "./key-material";
import { KeyStatus } from "./key-status";

interface KeyProps {
  keyRingId: UniqueId;
  algorithm: KeyAlgorithm;
  material: KeyMaterial; // encrypted with MasterKey
  version: number;
  status: KeyStatus;
  createdAt: Date;
  rotatedAt?: Date;
}

export class Key extends AggregateRoot<KeyProps> {
  private constructor(
    readonly props: KeyProps,
    id?: UniqueId,
  ) {
    super(props, id);
  }

  public static create(keyRingId: UniqueId, algorithm: KeyAlgorithm, material: KeyMaterial, version: number): Key {
    return new Key({
      keyRingId,
      algorithm,
      material,
      version,
      status: KeyStatus.ACTIVE,
      createdAt: new Date(),
    });
  }

  public rotate(newMaterial: KeyMaterial): Key {
    if (this.props.status !== KeyStatus.ACTIVE) {
      throw new Error("Only active keys can be rotated.");
    }

    this.props.status = KeyStatus.ROTATED;
    this.props.rotatedAt = new Date();

    return Key.create(this.props.keyRingId, this.props.algorithm, newMaterial, this.props.version + 1);
  }

  public revoke() {
    this.props.status = KeyStatus.REVOKED;
  }

  public get isActive(): boolean {
    return this.props.status === KeyStatus.ACTIVE;
  }

  public get material(): KeyMaterial {
    return this.props.material;
  }

  public get version(): number {
    return this.props.version;
  }
}
