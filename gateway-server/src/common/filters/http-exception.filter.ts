// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log("들어옴?2");
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '알 수 없는 오류입니다.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res['message']) {
        message = res['message'];
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
