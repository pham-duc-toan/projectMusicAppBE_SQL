// Unit test cho LocalStrategy
// Giải thích: Test validate trả về user hợp lệ, và ném lỗi khi user không hợp lệ.

import { LocalStrategy } from '../passport/local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = { validateUser: jest.fn() } as any;
    strategy = new LocalStrategy(authService);
  });

  it('should return user if valid', async () => {
    const user = { id: 1 };
    authService.validateUser.mockResolvedValue(user);
    const result = await strategy.validate('user', 'pass');
    expect(result).toBe(user);
    expect(authService.validateUser).toHaveBeenCalledWith('user', 'pass');
  });

  it('should throw UnauthorizedException if invalid', async () => {
    authService.validateUser.mockResolvedValue(null);
    await expect(strategy.validate('user', 'pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
