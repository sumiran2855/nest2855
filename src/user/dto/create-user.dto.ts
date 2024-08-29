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

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsStrongPassword()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsNotEmpty({ message: 'Confirm password should not be empty' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword?: string;

  businessName?: string;

  phone?: string;

  website?: string;

  streetAddress?: string;

  @IsOptional()
  @IsString()
  streetAddress2?: string;

  city?: string;

  state?: string;

  zipCode?: string;

  @IsNotEmpty({ message: 'First name should not be empty' })
  @IsString()
  firstName?: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  @IsString()
  lastName?: string;

  ownerPhone?: string;

  role?: string;

  otp?: string;
}



