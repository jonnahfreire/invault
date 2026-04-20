import { Request } from "express";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import AuthorizationService from "../../../application/services/authorization.service";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
import { Environment } from "src/application/config/environment";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class UserApiKeyGuard implements CanActivate {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly environment: Environment,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.headers["x-api-key"] as string;
    const authorization = await this.authorizationService.getClientAuthorization(apiKey);
    if (!authorization.authorized) throw new IllegalAccessException("Não autorizado");

    request.user = {
      id: authorization.id!,
      name: authorization.name!,
    };

    return true;
  }
}
