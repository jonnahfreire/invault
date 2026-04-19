import { DATE } from "sequelize";

type DateLike = { format(mask: string): string };

type SequelizeDateProto = {
  _applyTimezone(date: unknown, options?: unknown): DateLike;
  _stringify?: (date: unknown, options?: unknown) => string;
  __gcrStringifyPatched?: boolean;
};

export function ensureSequelizeDateStringifyPatch(): void {
  const proto = DATE.prototype as unknown as SequelizeDateProto;

  if (proto.__gcrStringifyPatched) return;

  proto._stringify = function _stringify(this: SequelizeDateProto, date: unknown, options?: unknown): string {
    const zoned = this._applyTimezone(date, options);
    return zoned.format("YYYY-MM-DD HH:mm:ss.SSS");
  };

  proto.__gcrStringifyPatched = true;
}
