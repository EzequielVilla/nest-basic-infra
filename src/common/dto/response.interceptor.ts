import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const logger = new Logger('ERROR_INTERCEPTOR_LOGGER');
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'SERVER_UNEXPECTED_ERROR';
    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      const errorIsObject = typeof errorResponse === 'object';
      const errorIsNull = errorResponse === null;
      const isHttpException = typeof errorResponse === 'string';
      if (errorIsObject && !errorIsNull) {
        // Validation error
        const haveAMessage = 'message' in errorResponse;
        message = haveAMessage
          ? (message = errorResponse['message'] as string)
          : (message = JSON.stringify(errorResponse));
      } else if (isHttpException) {
        message = errorResponse;
      }

      logger.error(
        `ENDPOINT_PATH: ${request.url} \n CAUSE: ${exception.cause},\n STACK: ${exception.stack}`,
      );
    }
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message,
    });
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      result: res,
    };
  }
}
