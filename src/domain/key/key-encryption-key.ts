import { UniqueId } from "@domain/@common/uniqueid";
import { Entity } from "../@common/entity";
import { SecretType } from "@domain/secret/secret";
import { KekType } from "./key-derivation";

interface KeyEncryptionKeyProps {
  salt: string; // salt used for KEK derivation, stored for reference
  type: string; // type of KEK, can be used for selecting the right derivation parameters
  env: string; // environment (e.g., "production", "staging"), can be used for selecting the right derivation parameters
  version: number; // optional, can be used to track KEK versions
  createdAt?: Date;
}

export class KeyEncryptionKey extends Entity<KeyEncryptionKeyProps> {
  constructor(props: KeyEncryptionKeyProps, id?: UniqueId) {
    super(props, id);
  }

  public static create(type: string, env: string, version?: number): KeyEncryptionKey {
    return new KeyEncryptionKey({
      salt: UniqueId.create().toString(),
      type,
      env,
      version: version ?? 1,
      createdAt: new Date(),
    });
  }

  public get salt(): string {
    return this.props.salt;
  }

  public get type(): string {
    return this.props.type;
  }

  public get env(): string {
    return this.props.env;
  }

  public get version(): number {
    return this.props.version ?? 1;
  }

  static fromSecretType(secretType: SecretType): KekType {
    switch (secretType) {
      case "database":
        return KekType.DATABASE;
      case "certificate":
        return KekType.CERTIFICATE;
      case "apikey":
        return KekType.AIPKEY;
      case "jwt":
        return KekType.JWT;
      case "ssh":
        return KekType.SSH;
      case "kv":
        return KekType.KV;
      default:
        throw new Error(`Unsupported secret type`);
    }
  }
}
