// Unit test cho ForgotPasswordController
// Kiểm tra controller gọi đúng service và trả về kết quả mong đợi
import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordController } from '../forgot-password.controller';
import { ForgotPasswordService } from '../forgot-password.service';

describe('ForgotPasswordController', () => {
  let controller: ForgotPasswordController;
  let service: ForgotPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
      providers: [
        {
          provide: ForgotPasswordService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue('OTP đã được gửi đến email của bạn'),
            verifyOtp: jest.fn().mockResolvedValue('Đã đặt lại mật khẩu mới !'),
          },
        },
      ],
    }).compile();
    controller = module.get<ForgotPasswordController>(ForgotPasswordController);
    service = module.get<ForgotPasswordService>(ForgotPasswordService);
  });

  it('should request OTP', async () => {
    const dto = { email: 'a@b.com' };
    const result = await controller.requestOtp(dto);
    expect(result).toBe('OTP đã được gửi đến email của bạn');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should verify OTP', async () => {
    const dto = { email: 'a@b.com', otp: '123456', passNew: 'newpass' };
    const result = await controller.verifyOtp(dto);
    expect(result).toBe('Đã đặt lại mật khẩu mới !');
    expect(service.verifyOtp).toHaveBeenCalledWith(dto);
  });
});
