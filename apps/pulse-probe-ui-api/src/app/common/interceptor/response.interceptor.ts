import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((res: any) => {
        // If the controller returned a raw response like { data, message, statusCode }, use it
        const {
          data,
          message = 'Request successful',
          statusCode = response.statusCode || 200,
        } = res ?? {};

        return {
          statusCode,
          success: statusCode < 400,
          message,
          data,
        };
      })
    );
  }
}
