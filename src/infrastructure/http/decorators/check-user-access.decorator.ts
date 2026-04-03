import { SetMetadata } from "@nestjs/common";

export const USER_ACCESS_KEY = "user_access";

export interface AccessOptions {
  source: "params" | "body" | "query";
  field: string;
  checkBy: string;
}

export const CheckUserAccess = (options: AccessOptions) => SetMetadata(USER_ACCESS_KEY, options);
