import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => this.writeLog(request, response, startedAt)),
      catchError((error: unknown) => {
        this.writeLog(request, response, startedAt);
        return throwError(() => error);
      }),
    );
  }

  private writeLog(request: Request, response: Response, startedAt: number): void {
    const durationMs = Date.now() - startedAt;
    const userAgent = request.headers['user-agent'];

    this.prisma.requestLog
      .create({
        data: {
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs,
          ip: request.ip ?? null,
          userAgent: typeof userAgent === 'string' ? userAgent : null,
        },
      })
      .catch((error: unknown) => {
        console.error('Failed to write request log', error);
      });
  }
}
