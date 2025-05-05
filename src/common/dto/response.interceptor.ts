import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => {
        this.errorHandler(err, context);
        return new Observable<never>();
      }),
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
    const isBadRequest = exception instanceof BadRequestException;
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
    }
    if (process.env.NODE_ENV !== 'test') {
      logger.error(
        `\n ENDPOINT_PATH: ${request.url} \n CAUSE: ${exception.cause || message} \n STACK_ERROR: ${exception.stack}`,
      );
    }
    logger.error(
      `ENDPOINT_PATH: ${request.url} \n CAUSE: ${exception.cause || message} \n STACK_ERROR: ${exception.stack}`,
    );
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: isBadRequest ? 'BAD_REQUEST_ERROR' : message,
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
