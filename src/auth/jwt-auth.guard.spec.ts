import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, JwtPayload } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verify: jest.Mock };

  const buildContext = (authorization?: string): ExecutionContext => {
    const request: { headers: Record<string, string>; user?: JwtPayload } = {
      headers: authorization ? { authorization } : {},
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = { verify: jest.fn() };
    guard = new JwtAuthGuard(jwtService as unknown as JwtService);
  });

  it('throws UnauthorizedException when no Authorization header is present', async () => {
    const context = buildContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the header is not a Bearer token', async () => {
    const context = buildContext('Basic abc123');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when the token fails verification', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid signature');
    });
    const context = buildContext('Bearer bad-token');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('allows the request and attaches the payload when the token is valid', async () => {
    const payload: JwtPayload = { sub: '1', username: 'dung' };
    jwtService.verify.mockReturnValue(payload);
    const context = buildContext('Bearer good-token');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    expect(request.user).toEqual(payload);
  });
});
