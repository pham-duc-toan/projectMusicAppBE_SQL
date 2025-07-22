// Unit test chuyên nghiệp cho AuthService
// Giải thích: File này kiểm tra tất cả các hàm public của AuthService, mock các service phụ thuộc, kiểm tra các trường hợp thành công và thất bại.

import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

const mockUser = {
  id: '1',
  userId: '1',
  fullName: 'Test User',
  username: 'testuser',
  avatar: 'avatar.jpg',
  type: 'SYSTEM' as 'SYSTEM', // Đảm bảo đúng literal type
  role: {
    id: '1', // Sửa từ number sang string để đúng interface User
    name: 'user',
    roleName: 'user',
    permissions: [],
    deleted: false,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    generateId: jest.fn(),
  },
  singerId: {
    id: '2',
    name: 'Test Singer',
    fullName: 'Test Singer',
    avatar: 'singer-avatar.jpg',
    status: 'active' as 'active', // Đảm bảo đúng literal type
    slug: 'test-singer',
    songs: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
    deletedAt: null,
    generateId: jest.fn(),
    // Bổ sung các trường cần thiết nếu interface Singer có thêm
  },
  refreshToken: '',
  listPlaylist: [],
  listFavoriteSong: [],
  email: 'testuser@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deleted: false,
  deletedAt: null,
  // Bổ sung các trường còn thiếu để khớp với interface User
  password: 'hashed-password',
  status: 'active' as 'active',
  generateId: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    usersService = {
      checkUserLogin: jest.fn(),
      findByTokenRefresh: jest.fn(),
      updateTokenRefresh: jest.fn(),
      findOneByEmailGoogle: jest.fn(),
      createOAuthGoogle: jest.fn(),
    } as any;
    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
      verify: jest.fn(),
    } as any;
    configService = {
      get: jest.fn().mockImplementation((key) => {
        if (key === 'JWT_REFRESH_TOKEN_SECRET') return 'secret';
        if (key === 'JWT_REFRESH_EXPIRE') return '1d';
        return undefined;
      }),
    } as any;
    authService = new AuthService(usersService, jwtService, configService);
  });

  describe('validateUser', () => {
    it('should call usersService.checkUserLogin', async () => {
      usersService.checkUserLogin.mockResolvedValue(mockUser);
      const result = await authService.validateUser('testuser', '123');
      expect(usersService.checkUserLogin).toHaveBeenCalledWith(
        'testuser',
        '123',
      );
      expect(result).toBe(mockUser);
    });
  });

  describe('createRefreshToken', () => {
    it('should return signed refresh token', () => {
      const payload = { username: 'testuser' };
      const token = authService.createRefreshToken(payload);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, expect.any(Object));
      expect(token).toBe('signed-token');
    });
  });

  describe('checkTokenRefresh', () => {
    it('should return new tokens and user info if refresh token valid', async () => {
      jwtService.verify.mockReturnValue({});
      usersService.findByTokenRefresh.mockResolvedValue({ ...mockUser });
      usersService.updateTokenRefresh.mockResolvedValue(undefined);
      const result = await authService.checkTokenRefresh('refresh-token');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('user');
    });
    it('should throw BadRequestException if user not found', async () => {
      jwtService.verify.mockReturnValue({});
      usersService.findByTokenRefresh.mockResolvedValue(null);
      await expect(
        authService.checkTokenRefresh('refresh-token'),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException if jwtService.verify throws', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });
      await expect(
        authService.checkTokenRefresh('refresh-token'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return tokens and user info', async () => {
      usersService.updateTokenRefresh.mockResolvedValue(undefined);
      const result = await authService.login(mockUser);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('user');
      expect(usersService.updateTokenRefresh).toHaveBeenCalled();
    });
  });

  describe('logOut', () => {
    it('should clear refresh token and return status', async () => {
      usersService.updateTokenRefresh.mockResolvedValue(undefined);
      const response = { clearCookie: jest.fn() } as any;
      const result = await authService.logOut(mockUser, response);
      expect(usersService.updateTokenRefresh).toHaveBeenCalledWith(
        '',
        mockUser.id,
      );
      expect(response.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(result).toEqual({ status: 'Logout success' });
    });
  });

  describe('validateGoogleUser', () => {
    it('should return user if found', async () => {
      usersService.findOneByEmailGoogle.mockResolvedValue(mockUser);
      const result = await authService.validateGoogleUser({ email: 'a@b.com' });
      expect(result).toBe(mockUser);
    });
    it('should create user if not found', async () => {
      usersService.findOneByEmailGoogle.mockResolvedValue(null);
      usersService.createOAuthGoogle.mockResolvedValue(mockUser);
      const result = await authService.validateGoogleUser({ email: 'a@b.com' });
      expect(result).toBe(mockUser);
    });
  });
});
