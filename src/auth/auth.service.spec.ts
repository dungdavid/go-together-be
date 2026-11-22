import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcryptjs');

type MockUserDelegate = {
  findUnique: jest.Mock;
  create: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let user: MockUserDelegate;
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    user = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: { user } },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
    jwtService.sign.mockReturnValue('signed-token');
  });

  describe('register', () => {
    it('throws ConflictException when the username is already taken', async () => {
      user.findUnique.mockResolvedValue({ id: '1', username: 'dung' });

      await expect(
        service.register({ username: 'dung', displayName: 'Dung', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
      expect(user.create).not.toHaveBeenCalled();
    });

    it('creates a user with a hashed password and returns an access token', async () => {
      user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      const created = {
        id: '1',
        username: 'dung',
        displayName: 'Dung',
        passwordHash: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      user.create.mockResolvedValue(created);

      const result = await service.register({
        username: 'dung',
        displayName: 'Dung',
        password: 'password123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(user.create).toHaveBeenCalledWith({
        data: { username: 'dung', passwordHash: 'hashed-password', displayName: 'Dung' },
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        user: { id: '1', username: 'dung', displayName: 'Dung' },
      });
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when the username does not exist', async () => {
      user.findUnique.mockResolvedValue(null);

      await expect(service.login({ username: 'missing', password: 'password123' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      user.findUnique.mockResolvedValue({
        id: '1',
        username: 'dung',
        displayName: 'Dung',
        passwordHash: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ username: 'dung', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns an access token when the password matches', async () => {
      user.findUnique.mockResolvedValue({
        id: '1',
        username: 'dung',
        displayName: 'Dung',
        passwordHash: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ username: 'dung', password: 'password123' });

      expect(result).toEqual({
        accessToken: 'signed-token',
        user: { id: '1', username: 'dung', displayName: 'Dung' },
      });
    });
  });

  describe('getProfile', () => {
    it('throws UnauthorizedException when the user no longer exists', async () => {
      user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('missing')).rejects.toThrow(UnauthorizedException);
    });

    it('returns the profile when the user exists', async () => {
      user.findUnique.mockResolvedValue({ id: '1', username: 'dung', displayName: 'Dung' });

      const result = await service.getProfile('1');

      expect(result).toEqual({ id: '1', username: 'dung', displayName: 'Dung' });
    });
  });
});
