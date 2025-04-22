import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../interface/api-response.interface';

export const apiResponseInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse;

        if (body?.success === false) {
          throw {
            statusCode: body.statusCode,
            message: body.message,
            originalResponse: body,
          };
        }

        return event.clone({ body });
      }

      return event;
    }),
    catchError((err) => throwError(() => err))
  );
};
