import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { DomainException } from "@domain/@common/exceptions/domain.exception";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.status ?? HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      error: exception.code,
      message: exception.message,
    });
  }
}
