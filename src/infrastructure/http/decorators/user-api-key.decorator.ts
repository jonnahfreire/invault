import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserApiKeyGuard } from "../guards/user-api-key.guard";

export function UserApiKeyAuth() {
  return applyDecorators(UseGuards(UserApiKeyGuard));
}
