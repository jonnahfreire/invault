import { UniqueId } from "./uniqueid";

export abstract class Entity<T> {
  protected readonly _id: UniqueId;
  protected _isNew: boolean;
  protected props: T;

  protected constructor(props: T, id?: UniqueId) {
    this._id = id ?? UniqueId.create();
    this._isNew = this._id.isDirty();
    this.props = props;
  }

  public get id(): UniqueId {
    return this._id;
  }

  get isNew() {
    return this._isNew;
  }

  equals(entity?: Entity<T> | null): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;

    return this._id.equals(entity._id);
  }
}
