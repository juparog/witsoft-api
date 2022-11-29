import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
// import { nanoid } from 'nanoid';
import { RequestContextService } from './AppRequestContext';
import { uuidv4To12 } from '../../utils/generate-uuid.utils';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // const requestId = request?.body?.requestId ?? nanoid(6);
    const requestId = request?.body?.requestId ?? uuidv4To12();

    RequestContextService.setRequestId(requestId);

    return next.handle().pipe(
      tap(() => {
        // Realice la limpieza si es necesario
      }),
    );
  }
}
