import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { ResponseWrapper } from "./response.wrapper";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseWrapper<T>> {
        return next.handle().pipe(map(data => new ResponseWrapper(data, 'success')));
    }
};
