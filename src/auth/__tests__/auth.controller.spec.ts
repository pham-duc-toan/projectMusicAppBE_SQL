// Unit test chuyên nghiệp cho AuthController
// Giải thích: File này kiểm tra các endpoint chính của AuthController, mock AuthService và UserService, kiểm tra các response trả về đúng.

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      checkTokenRefresh: jest.fn(),
      logOut: jest.fn(),
    } as any;
    userService = {} as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const req = { user: { id: 1 }, ip: '127.0.0.1', headers: {} };
      const res = {} as Response;
      authService.login.mockResolvedValue({
        access_token: 'a',
        refresh_token: 'b',
        user: {
          singerId: 1,
          id: 1,
          fullName: 'Test User',
          username: 'testuser',
          role: { name: 'user', permissions: [] },
          avatar: 'avatar.jpg',
          type: 'user',
        },
      });
      const result = await controller.login(req, res);
      expect(authService.login).toHaveBeenCalledWith(req.user, res);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('refreshToken', () => {
    it('should call authService.checkTokenRefresh and return result', async () => {
      const body = { refreshToken: 'token' };
      const res = {} as Response;
      authService.checkTokenRefresh.mockResolvedValue({
        access_token: 'a',
        refresh_token: 'b',
        user: {
          singerId: 1,
          id: 1,
          fullName: 'Test User',
          username: 'testuser',
          role: { name: 'user', permissions: [] },
          avatar: 'avatar.jpg',
          type: 'user',
        },
      });
      const result = await controller.refreshToken(body, res);
      expect(authService.checkTokenRefresh).toHaveBeenCalledWith('token', res);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('logOut', () => {
    it('should call authService.logOut and return result', async () => {
      const req = { user: { id: 1 } };
      const res = {} as Response;
      authService.logOut.mockResolvedValue({ status: 'Logout success' });
      const result = await controller.logOut(req, res);
      expect(authService.logOut).toHaveBeenCalledWith(req.user, res);
      expect(result).toEqual({ status: 'Logout success' });
    });
  });

  describe('googleLogin', () => {
    it('should be defined (guarded, no logic)', () => {
      expect(controller.googleLogin()).toBeUndefined();
    });
  });

  describe('googleCallback', () => {
    it('should redirect with tokens', async () => {
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.JWT_ACCESS_EXPIRE = '600s';
      process.env.JWT_REFRESH_EXPIRE = '1d';
      const req = { user: { id: 1 } };
      const res = { redirect: jest.fn() } as any;
      authService.login.mockResolvedValue({
        access_token: 'a',
        refresh_token: 'b',
        user: {
          singerId: 1,
          id: 1,
          fullName: 'Test User',
          username: 'testuser',
          role: { name: 'user', permissions: [] },
          avatar: 'avatar.jpg',
          type: 'user',
        },
      });
      await controller.googleCallback(req, res);
      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('access_token=a'),
      );
    });
  });
});
