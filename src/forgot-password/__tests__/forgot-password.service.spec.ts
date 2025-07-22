// Unit test chuyên nghiệp cho ForgotPasswordService
// Giải thích: Test các hàm gửi OTP, xác thực OTP, xóa OTP hết hạn, mock repo và userService, không gửi mail thật.

import { ForgotPasswordService } from '../forgot-password.service';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForgotPassword } from '../entities/forgot-password.entity';
import { CronExpression } from '@nestjs/schedule';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({ sendMail: jest.fn() }),
}));

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let forgotPasswordRepo: jest.Mocked<Repository<ForgotPassword>>;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    forgotPasswordRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    } as any;
    userService = { changePasswordByOTP: jest.fn() } as any;
    service = new ForgotPasswordService(forgotPasswordRepo, userService);
    jest.spyOn(service as any, 'sendOtpEmail').mockResolvedValue(undefined);
  });

  describe('create', () => {
    it('should update existing record and send OTP', async () => {
      forgotPasswordRepo.findOne.mockResolvedValue({ email: 'a@b.com' } as any);
      forgotPasswordRepo.save.mockResolvedValue(undefined);
      const result = await service.create({ email: 'a@b.com' });
      expect(forgotPasswordRepo.save).toHaveBeenCalled();
      expect(service['sendOtpEmail']).toHaveBeenCalled();
      expect(result).toBe('OTP đã được gửi đến email của bạn');
    });
    it('should create new record and send OTP', async () => {
      forgotPasswordRepo.findOne.mockResolvedValue(null);
      forgotPasswordRepo.create.mockReturnValue({ email: 'a@b.com' } as any);
      forgotPasswordRepo.save.mockResolvedValue(undefined);
      const result = await service.create({ email: 'a@b.com' });
      expect(forgotPasswordRepo.create).toHaveBeenCalled();
      expect(forgotPasswordRepo.save).toHaveBeenCalled();
      expect(service['sendOtpEmail']).toHaveBeenCalled();
      expect(result).toBe('OTP đã được gửi đến email của bạn');
    });
  });

  describe('verifyOtp', () => {
    it('should throw if record not found or expired', async () => {
      forgotPasswordRepo.findOne.mockResolvedValue(null);
      await expect(
        service.verifyOtp({ email: 'a@b.com', otp: '123456', passNew: 'new' }),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw if record expired', async () => {
      forgotPasswordRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        otp: '123456',
        expiredAt: new Date(Date.now() - 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        generateId: jest.fn(),
      } as any);
      await expect(
        service.verifyOtp({ email: 'a@b.com', otp: '123456', passNew: 'new' }),
      ).rejects.toThrow(BadRequestException);
    });
    it('should delete record, change password and return success', async () => {
      forgotPasswordRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        otp: '123456',
        expiredAt: new Date(Date.now() + 10000),
        createdAt: new Date(),
        updatedAt: new Date(),
        generateId: jest.fn(),
      } as any);
      forgotPasswordRepo.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);
      userService.changePasswordByOTP.mockResolvedValue(undefined);
      const result = await service.verifyOtp({
        email: 'a@b.com',
        otp: '123456',
        passNew: 'new',
      });
      expect(forgotPasswordRepo.delete).toHaveBeenCalledWith({
        email: 'a@b.com',
      });
      expect(userService.changePasswordByOTP).toHaveBeenCalledWith(
        'a@b.com',
        'new',
      );
      expect(result).toBe('Đã đặt lại mật khẩu mới !');
    });
  });

  describe('deleteExpiredOtps', () => {
    it('should log if OTPs deleted', async () => {
      forgotPasswordRepo.delete.mockResolvedValue({
        affected: 2,
        raw: {},
      } as any);
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'log')
        .mockImplementation();
      await service.deleteExpiredOtps();
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Đã xóa 2 OTP đã hết hạn'),
      );
      loggerSpy.mockRestore();
    });
    it('should not log if no OTP deleted', async () => {
      forgotPasswordRepo.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      } as any);
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'log')
        .mockImplementation();
      await service.deleteExpiredOtps();
      expect(loggerSpy).not.toHaveBeenCalled();
      loggerSpy.mockRestore();
    });
  });
});
