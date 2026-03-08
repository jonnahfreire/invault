import { UniqueId } from "./uniqueid";

export abstract class Entity<T> {
  protected readonly _id: UniqueId;
  readonly props: T;

  protected constructor(props: T, id?: UniqueId) {
    this._id = id ?? UniqueId.create();
    this.props = props;
  }

  public get id(): UniqueId {
    return this._id;
  }
}
