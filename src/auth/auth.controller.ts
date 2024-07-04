import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    const token = await this.authService.login(
      createAuthDto.username,
      createAuthDto.password,
    );
    return { message: 'User login successful', token };
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
