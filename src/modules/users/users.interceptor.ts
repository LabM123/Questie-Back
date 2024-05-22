import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable, map } from 'rxjs';

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isArray(data))
          return data.map((item) => {
            if (item.password) delete item.password;
            if (item.confirmPassword) delete item.confirmPassword;
            return item;
          });

        if (data.password) delete data.password;
        if (data.confirmPassword) delete data.confirmPassword;
        return data;
      }),
    );
  }
}
