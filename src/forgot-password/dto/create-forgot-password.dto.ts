import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng để gửi mã OTP đặt lại mật khẩu.',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
