// Unit test chuyên nghiệp cho JwtAuthGuard
// Giải thích: File này kiểm tra các nhánh logic chính của JwtAuthGuard: public route, private route, quyền truy cập, lỗi token.

import { JwtAuthGuard } from '../passport/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    const mockContext = (method = 'GET', path = '/test') =>
      ({
        switchToHttp: () => ({
          getRequest: () => ({ method, route: { path } }),
        }),
      }) as any;

    it('should throw UnauthorizedException if no user', () => {
      expect(() =>
        guard.handleRequest(null, null, null, mockContext()),
      ).toThrow(UnauthorizedException);
    });
    it('should return user if not private route', () => {
      const user = { listPrivate: [], permissions: [] };
      expect(guard.handleRequest(null, user, null, mockContext())).toBe(user);
    });
    it('should return user if private route and has permission', () => {
      const user = {
        listPrivate: [{ method: 'GET', pathName: '/test' }],
        permissions: [{ method: 'GET', pathName: '/test' }],
      };
      expect(guard.handleRequest(null, user, null, mockContext())).toBe(user);
    });
    it('should throw ForbiddenException if private route and no permission', () => {
      const user = {
        listPrivate: [{ method: 'GET', pathName: '/test' }],
        permissions: [],
      };
      expect(() =>
        guard.handleRequest(null, user, null, mockContext()),
      ).toThrow(ForbiddenException);
    });
  });
});
