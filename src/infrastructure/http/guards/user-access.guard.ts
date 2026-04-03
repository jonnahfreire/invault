import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { USER_ACCESS_KEY } from "../decorators/check-user-access.decorator";
import IllegalArgumentException from "src/application/exceptions/illegal-argument.exception";

@Injectable()
export class UserAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride(USER_ACCESS_KEY, [context.getHandler(), context.getClass()]);

    if (!options) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const { source, field } = options;
    const value = request.get(`${source}`)?.[field];

    if (!value) throw new IllegalArgumentException("Identificador não informado");

    return true;
  }
}
