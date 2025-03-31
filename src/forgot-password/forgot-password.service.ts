import * as nodemailer from 'nodemailer';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserService } from 'src/users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ForgotPassword } from './entities/forgot-password.entity';

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);

  constructor(
    @InjectRepository(ForgotPassword)
    private forgotPasswordRepo: Repository<ForgotPassword>,
    private readonly userService: UserService,
  ) {}

  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AppMusicToandeptrai" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mã OTP của bạn',
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 3 phút.`,
    };

    await transporter.sendMail(mailOptions);
  }

  async create(
    createForgotPasswordDto: CreateForgotPasswordDto,
  ): Promise<string> {
    const { email } = createForgotPasswordDto;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 180 * 1000); // 3 phút

    const existingRecord = await this.forgotPasswordRepo.findOne({
      where: { email },
    });

    if (existingRecord) {
      existingRecord.otp = otp;
      existingRecord.expiredAt = expiredAt;
      await this.forgotPasswordRepo.save(existingRecord);
    } else {
      const record = this.forgotPasswordRepo.create({ email, otp, expiredAt });
      await this.forgotPasswordRepo.save(record);
    }

    await this.sendOtpEmail(email, otp);
    return 'OTP đã được gửi đến email của bạn';
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<string> {
    const { email, otp, passNew } = verifyOtpDto;

    const record = await this.forgotPasswordRepo.findOne({
      where: { email, otp },
    });

    if (!record || record.expiredAt < new Date()) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
    }

    // Xoá sau khi dùng xong
    await this.forgotPasswordRepo.delete({ email });

    // Đổi mật khẩu
    await this.userService.changePasswordByOTP(email, passNew);

    return 'Đã đặt lại mật khẩu mới !';
  }

  // Cron tự động xóa OTP hết hạn mỗi phút
  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredOtps() {
    const now = new Date();
    const result = await this.forgotPasswordRepo.delete({
      expiredAt: LessThan(now),
    });

    if (result.affected) {
      this.logger.log(`Đã xóa ${result.affected} OTP đã hết hạn`);
    }
  }
}
