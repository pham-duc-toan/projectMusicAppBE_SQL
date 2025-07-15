import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { CreateForgotPasswordDto } from './dto/create-forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Forgot Password')
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('request')
  @ApiOperation({ summary: 'Gửi yêu cầu lấy mã OTP quên mật khẩu' })
  @ApiResponse({ status: 201, description: 'Gửi OTP thành công' })
  @ApiBody({ type: CreateForgotPasswordDto })
  async requestOtp(@Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    return this.forgotPasswordService.create(createForgotPasswordDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Xác thực mã OTP quên mật khẩu' })
  @ApiResponse({ status: 200, description: 'Xác thực OTP thành công' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.forgotPasswordService.verifyOtp(verifyOtpDto);
  }
}
