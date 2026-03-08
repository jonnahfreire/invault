import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ApplicationException } from "src/application/exceptions/application.exception";
import ArgumentNullException from "src/application/exceptions/argument-null.exception";
import ArgumentConflictException from "src/application/exceptions/conflict.exception";
import IllegalAccessException from "src/application/exceptions/illegal-access.exception";
import IllegalArgumentException from "src/application/exceptions/illegal-argument.exception";
import ResourceNotFoundException from "src/application/exceptions/resource-not-found.exception";

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ArgumentNullException) {
      status = HttpStatus.BAD_REQUEST;
    }
    if (exception instanceof IllegalArgumentException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    }
    if (exception instanceof ResourceNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }
    if (exception instanceof ArgumentConflictException) {
      status = HttpStatus.CONFLICT;
    }
    if (exception instanceof IllegalAccessException) {
      status = HttpStatus.UNAUTHORIZED;
    }

    response.status(status).json({
      message: exception.message,
    });
  }
}
