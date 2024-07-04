import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './jwt/jwt.strategy';
import { EmailService } from '../email/email.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private emailService: EmailService,
  ) {}

  // signIn
  async login(
    username: string,
    password: string,
  ): Promise<{ token: string; role: string }> {
    const user = await this.usersService.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '10m' });
    return { token, role: user.role };
  }

  // send mail using nodemailer
  async sendPasswordResetEmail(username: string): Promise<void> {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.generatePasswordResetToken(user);
    const resetLink = `https://example.com/reset-password?token=${token}`;

    const subject = 'Password Reset Request';
    const text = `Dear ${user.username},\n\nPlease click on the following link to reset your password:\n${resetLink}\n\nIf you did not request this, please ignore this email.`;

    try {
      await this.emailService.sendMail(user.email, subject, text);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // reset password using token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.validatePasswordResetToken(token);

    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await this.usersService.updatePassword(user.id, hashedPassword);
  }

  // reset Token generation
  private async generatePasswordResetToken(user: User): Promise<string> {
    const payload = { userId: user.id };
    return jwt.sign(payload, jwtConstants.secret, { expiresIn: '10m' });
  }

  //validate Password Reset token
  private async validatePasswordResetToken(
    token: string,
  ): Promise<User | null> {
    try {
      const decoded: any = jwt.verify(token, jwtConstants.secret);
      const user = await this.usersService.findOne({ id: decoded.userId });
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return null;
    }
  }
}
