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

  companyName?: string;

  mobileNumber?: string;

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

  phoneNumber?: string;

  role?: string;

  otp?: string;
}



// import {
//   IsArray,
//   IsEmail,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsStrongPassword,
//   MinLength,
//   ValidateNested,
// } from 'class-validator';
// import { Match } from '../entities/validator';
// import { Type } from 'class-transformer';

// export class CreateUserDto {
//   @IsEmail({}, { message: 'Email is invalid' })
//   email?: string;

//   @IsNotEmpty({ message: 'Password should not be empty' })
//   @IsStrongPassword()
//   @MinLength(6, { message: 'Password must be at least 6 characters long' })
//   password?: string;

//   @IsNotEmpty({ message: 'Confirm password should not be empty' })
//   @IsString()
//   @Match('password', { message: 'Passwords do not match' })
//   confirmPassword?: string;

//   @IsNotEmpty({ message: 'First name should not be empty' })
//   @IsString()
//   firstName?: string;

//   @IsNotEmpty({ message: 'Last name should not be empty' })
//   @IsString()
//   lastName?: string;

//   phoneNumber?: string;

//   role?: string;

//   otp?: string;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => BuisnessOwnerDTO)
//   @IsOptional()
//   businessOwner?: BuisnessOwnerDTO[];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => BankDetailsDto)
//   @IsOptional()
//   BankDetails?: BankDetailsDto[];
// }

// export class BuisnessOwnerDTO {
//   companyName?: string;
//   mobileNumber?: string;

//   website?: string;
//   firstName?: string;
//   lastName?: string;

//   streetAddress?: string;

//   @IsOptional()
//   @IsString()
//   streetAddress2?: string;

//   city?: string;

//   state?: string;

//   zipCode?: string;

//   TaxId?: string;

//   Type?: string;

//   JobTitle?: string;

//   DOB?: string;

//   SSN?: string;
// }

// export class BankDetailsDto {
//   @IsString()
//   bankAccountHolderName?: string;

//   @IsString()
//   bankAccountNumber?: string;

//   @IsString()
//   bankRoutingNumber?: string;

//   @IsString()
//   trustAccountHolderName?: string;

//   @IsString()
//   trustAccountNumber?: string;

//   @IsString()
//   trustRoutingNumber?: string;

//   @IsString()
//   Account?: string; 
// }
