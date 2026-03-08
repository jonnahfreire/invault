import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { USER_ACCESS_KEY } from "../../decorators/check-user-access.decorator";
import ResourceNotFoundException from "src/application/exceptions/resource-not-found.exception";
import IllegalArgumentException from "src/application/exceptions/illegal-argument.exception";

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride(USER_ACCESS_KEY, [context.getHandler(), context.getClass()]);

    if (!options) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const { source, field, checkBy } = options;
    const value = request[source]?.[field];

    if (!value) throw new IllegalArgumentException("Identificador não informado");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const hasAccess = user[checkBy]?.some((item: { id: number }) => item.id === Number(value));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!hasAccess && checkBy.includes("organizations")) throw new ResourceNotFoundException("Organização não encontrada");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!hasAccess && checkBy.includes("stores")) throw new ResourceNotFoundException("Loja não encontrada");

    return true;
  }
}
