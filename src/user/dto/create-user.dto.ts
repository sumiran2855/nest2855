import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { Match } from '../entities/validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @IsNotEmpty({ message: 'Username should not be empty' })
  @MinLength(3, { message: 'Username should be at least 3 characters long' })
  username?: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsStrongPassword()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsNotEmpty({ message: 'Confirm password should not be empty' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword?: string;

  @IsNotEmpty({ message: 'Please enter OTP' })
  @IsOptional()
  @IsString()
  otp?: string;
}
