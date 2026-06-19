import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { Message } from '../message.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Get the response object from the arguments host
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Get the status code from the exception
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Send a JSON response using the response object
    if (exception instanceof HttpException) {
      if (exception instanceof UnprocessableEntityException) {
        response.status(status).json({
          code: status,
          message: Message.ERROR_VALIDATION,
          errors: exception.getResponse()['message'],
        });
      } else {
        response.status(status).json({
          code: status,
          message: exception.getResponse()['message'],
          errors: exception.getResponse()['error'],
        });
      }
    } else {
      response.status(status).json({
        code: status,
        message: 'Internal Server Error',
        errors: exception ? exception.toString() : 'Unknown error occurred',
      });
    }
  }
}
