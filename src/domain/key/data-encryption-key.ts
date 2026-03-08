import { Entity } from "../@common/entity";
import { UniqueId } from "../@common/uniqueid";
import { KeyMaterial } from "./key-material";

interface DataEncryptionKeyProps {
  keyId: UniqueId; // KEK usada
  encryptedMaterial: KeyMaterial; // encrypted with KEK
  createdAt: Date;
}

export class DataEncryptionKey extends Entity<DataEncryptionKeyProps> {
  public static create(keyId: UniqueId, encryptedMaterial: KeyMaterial): DataEncryptionKey {
    return new DataEncryptionKey({
      keyId,
      encryptedMaterial,
      createdAt: new Date(),
    });
  }

  public get keyId(): UniqueId {
    return this.props.keyId;
  }

  public get material(): KeyMaterial {
    return this.props.encryptedMaterial;
  }
}
