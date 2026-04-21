import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserApiKeyGuard } from "../guards/user-api-key.guard";

export const IS_API_KEY_AUTH_KEY = "isApiKeyAuth";

export function UserApiKeyAuth() {
  return applyDecorators(SetMetadata(IS_API_KEY_AUTH_KEY, true), UseGuards(UserApiKeyGuard));
}
