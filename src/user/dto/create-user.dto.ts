import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';

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
}
