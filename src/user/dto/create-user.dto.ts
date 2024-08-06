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

  // @IsNotEmpty({ message: 'Company name should not be empty' })
  // @IsString()
  companyName?: string;

  // @IsNotEmpty({ message: 'Mobile number should not be empty' })
  // @IsString()
  mobileNumber?: string;

  // @IsNotEmpty({ message: 'Website should not be empty' })
  // @IsString()
  website?: string;

  // @IsNotEmpty({ message: 'Street address should not be empty' })
  // @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  streetAddress2?: string;

  // @IsNotEmpty({ message: 'City should not be empty' })
  // @IsString()
  city?: string;

  // @IsNotEmpty({ message: 'State should not be empty' })
  // @IsString()
  state?: string;

  // @IsNotEmpty({ message: 'Zip code should not be empty' })
  // @IsString()
  zipCode?: string;

  @IsNotEmpty({ message: 'First name should not be empty' })
  @IsString()
  firstName?: string;

  @IsNotEmpty({ message: 'Last name should not be empty' })
  @IsString()
  lastName?: string;

  // @IsNotEmpty({ message: 'Phone number should not be empty' })
  // @IsString()
  phoneNumber?: string;

  role?:string;

  otp?: string;
}
