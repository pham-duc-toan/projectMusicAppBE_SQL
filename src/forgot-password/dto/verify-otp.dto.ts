import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email dùng để xác minh OTP và đặt lại mật khẩu.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã OTP đã được gửi đến email người dùng.',
  })
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'Mật khẩu mới mà người dùng muốn đặt lại.',
  })
  @IsNotEmpty()
  passNew: string;
}
