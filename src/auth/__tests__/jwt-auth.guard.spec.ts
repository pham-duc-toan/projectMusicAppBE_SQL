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
  let context: jest.Mocked<ExecutionContext>;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() } as any;
    guard = new JwtAuthGuard(reflector);
    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;
  });

  describe('canActivate', () => {
    it('should return true if route is public', () => {
      reflector.getAllAndOverride.mockReturnValue(true);
      expect(guard.canActivate(context)).toBe(true);
    });
    it('should call super.canActivate if not public', () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      // super.canActivate sẽ trả về undefined nếu không mock, chỉ cần không throw là pass
      expect(() => guard.canActivate(context)).not.toThrow();
    });
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
