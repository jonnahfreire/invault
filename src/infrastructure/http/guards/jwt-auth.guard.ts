import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { IS_API_KEY_AUTH_KEY } from "../decorators/user-api-key.decorator";
import { Environment } from "@application/config/environment";
import IllegalAccessException from "@application/exceptions/illegal-access.exception";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly environment: Environment,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const isApiKeyAuth = this.reflector.getAllAndOverride<boolean>(IS_API_KEY_AUTH_KEY, [context.getHandler(), context.getClass()]);
    if (isApiKeyAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) throw new IllegalAccessException("Unauthorized: missing token");

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; name: string }>(token, {
        secret: this.environment.app.jwtSecret,
      });
      request.user = { id: payload.sub, name: payload.name, type: "user" };
    } catch {
      throw new IllegalAccessException("Unauthorized: invalid or expired token");
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : null;
  }
}
