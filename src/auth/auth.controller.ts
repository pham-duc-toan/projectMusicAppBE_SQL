import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponeMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Request as ReqExpress, Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserService } from 'src/users/users.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { GoogleAuthGuard } from './passport/google-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

const ms = require('ms');

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập bằng tài khoản hệ thống' })
  @ApiResponse({
    status: 201,
    description: 'Đăng nhập thành công, trả về token',
  })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const ip = req?.ip || req.headers['x-forwarded-for'];
    console.log('User IP:', ip);
    return this.authService.login(req.user, response);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access_token bằng refresh_token' })
  @ApiResponse({ status: 200, description: 'Refresh token thành công' })
  @ApiBody({ type: RefreshTokenDto })
  @ResponeMessage('Refresh access_token')
  refreshToken(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = body;
    return this.authService.checkTokenRefresh(refreshToken, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng xuất tài khoản' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ResponeMessage('LogOut')
  logOut(
    @Req() @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logOut(req.user, response);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Đăng nhập thông qua Google' })
  @ApiResponse({
    status: 302,
    description: 'Chuyển hướng tới trang đăng nhập Google',
  })
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Xử lý callback sau khi đăng nhập Google' })
  @ApiResponse({
    status: 302,
    description: 'Chuyển hướng về frontend kèm theo token',
  })
  async googleCallback(@Req() req, @Res() res) {
    const accessTokenExpire = ms(process.env.JWT_ACCESS_EXPIRE || '600s');
    const refreshTokenExpire = ms(process.env.JWT_REFRESH_EXPIRE || '1d');

    const response = await this.authService.login(req.user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/redirect-login-google?access_token=${response.access_token}&refresh_token=${response.refresh_token}&access_expire=${accessTokenExpire}&refresh_expire=${refreshTokenExpire}`,
    );
  }
}
