import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { RequestLoggingInterceptor } from './request-logging.interceptor';
import { PrismaService } from '../prisma/prisma.service';

describe('RequestLoggingInterceptor', () => {
  let interceptor: RequestLoggingInterceptor;
  let requestLogCreate: jest.Mock;

  const buildContext = (): ExecutionContext => {
    const request = {
      method: 'GET',
      originalUrl: '/places',
      ip: '127.0.0.1',
      headers: { 'user-agent': 'jest' },
    };
    const response = { statusCode: 200 };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    requestLogCreate = jest.fn().mockResolvedValue(undefined);
    const prisma = { requestLog: { create: requestLogCreate } } as unknown as PrismaService;
    interceptor = new RequestLoggingInterceptor(prisma);
  });

  it('writes a log entry after a successful response', (done) => {
    const context = buildContext();
    const next: CallHandler = { handle: () => of({ ok: true }) };

    interceptor.intercept(context, next).subscribe(() => {
      setImmediate(() => {
        expect(requestLogCreate).toHaveBeenCalledWith({
          data: {
            method: 'GET',
            path: '/places',
            statusCode: 200,
            durationMs: expect.any(Number),
            ip: '127.0.0.1',
            userAgent: 'jest',
          },
        });
        done();
      });
    });
  });

  it('writes a log entry and rethrows when the handler errors', (done) => {
    const context = buildContext();
    const error = new Error('boom');
    const next: CallHandler = { handle: () => throwError(() => error) };

    interceptor.intercept(context, next).subscribe({
      error: (err: unknown) => {
        expect(err).toBe(error);
        setImmediate(() => {
          expect(requestLogCreate).toHaveBeenCalled();
          done();
        });
      },
    });
  });

  it('still delivers the response when the log write fails', (done) => {
    const context = buildContext();
    const next: CallHandler = { handle: () => of({ ok: true }) };
    requestLogCreate.mockRejectedValueOnce(new Error('db down'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    interceptor.intercept(context, next).subscribe((value) => {
      expect(value).toEqual({ ok: true });
      setImmediate(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to write request log', expect.any(Error));
        consoleErrorSpy.mockRestore();
        done();
      });
    });
  });
});
