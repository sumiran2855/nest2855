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
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
// import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private emailService: EmailService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // signIn
  async login(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.update(user.id, { otp });

    const emailText = `Your OTP for login is: ${otp}`;
    await this.emailService.sendMail(user.email, 'Login OTP', emailText);

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '10m',
    });

    return {
      access_token,
      message: 'OTP sent successfully',
      otp,
    };
  }

  async verifyOTP(
    email: string,
    otp: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.usersService.update(user.id, { otp: null });

    const payload = { username: user.username, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '10m',
    });

    return { access_token };
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.usersService.findOneByID(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Update password in user entity
    await user.setPassword(newPassword);
    await this.userRepository.save(user);

    return user;
  }

  // send mail using nodemailer
  async sendPasswordResetEmail(username: string): Promise<void> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.generatePasswordResetToken(user);
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

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
    await this.usersService.update(user.id, { password: hashedPassword });
  }

  private async generatePasswordResetToken(user: User): Promise<string> {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: '10m' });
  }

  private async validatePasswordResetToken(token: string): Promise<User | null> {
    try {
      const decoded: any = this.jwtService.verify(token, { secret: jwtConstants.secret });
      const user = await this.usersService.findOneByID(decoded.userId);
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return null;
    }
  }
}
