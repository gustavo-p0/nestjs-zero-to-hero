import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const causeError = exception.getResponse();
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      httpMethod: request.method,
      path: request.url,
      cause: causeError,
    });
  }
}
