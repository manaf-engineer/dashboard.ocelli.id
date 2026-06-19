import { HttpException } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(
    message: string,
    statusCode: number,
    error: any[] | string | null = null,
  ) {
    super({ code: statusCode, message: message, error: error }, statusCode);
  }
}
