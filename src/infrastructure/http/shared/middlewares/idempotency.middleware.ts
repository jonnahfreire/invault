import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import crypto, { randomUUID as uuid } from "node:crypto";

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const idempotencyKey = req.headers["x-idempotency-key"] as string;
    if (!idempotencyKey) {
      return res.status(400).json({
        message: "Idempotency-Key header is required",
      });
    }

    req.idempotencyKey = idempotencyKey;
    req.correlationId = (req.headers["x-correlation-id"] as string) || uuid();

    req.requestHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(req.body ?? ""))
      .digest("hex");

    next();
  }
}
