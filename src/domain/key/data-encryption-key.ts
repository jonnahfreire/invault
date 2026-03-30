import { UniqueId } from "@domain/@common/uniqueid";
import { Entity } from "../@common/entity";

interface DataEncryptionKeyProps {
  keyId: UniqueId;
  kekVersion: number;
  iv: string;
  tag: string;
  cipher: string;
  createdAt?: Date;
}

export class DataEncryptionKey extends Entity<DataEncryptionKeyProps> {
  constructor(props: DataEncryptionKeyProps, id?: UniqueId) {
    super(props, id);
  }

  public static create(keyId: UniqueId, kekVersion: number, iv: string, tag: string, cipher: string): DataEncryptionKey {
    return new DataEncryptionKey({
      keyId,
      kekVersion,
      iv,
      tag,
      cipher,
      createdAt: new Date(),
    });
  }

  public get keyId(): UniqueId {
    return this.props.keyId;
  }

  public get kekVersion(): number {
    return this.props.kekVersion;
  }

  public get iv(): string {
    return this.props.iv;
  }

  public get tag(): string {
    return this.props.tag;
  }

  public get cipher(): string {
    return this.props.cipher;
  }
}
