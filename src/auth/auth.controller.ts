import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createAuthDto: { email: string; password: string }) {
    return this.authService.login(
      createAuthDto.email,
      createAuthDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOTP(@Req() req: any, @Body() verifyOtpDto: { otp: string }) {
    console.log('JWT payload:', req.user);
    const email = req.user.email;
    return this.authService.verifyLoginOTP(email, verifyOtpDto.otp);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('change-password')
  async changePassword(
    @Req() req: any,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<User> {
    const userId = req.user.userId;
    return this.authService.changePassword(userId, oldPassword, newPassword);
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-email')
  async sendPasswordResetEmail(@Body('username') username: string) {
    await this.authService.sendPasswordResetEmail(username);
    return { message: 'Email send successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password reset successfully' };
  }
}
