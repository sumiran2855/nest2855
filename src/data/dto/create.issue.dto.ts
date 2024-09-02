import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  minLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateIssueDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateAgreementDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(10, { message: 'Contact must be at least 10 characters long' })
  contact: string;

  @IsString()
  Address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @MinLength(6, { message: 'Zipcode must be at least 6 characters long' })
  zipcode: string;

  @IsString()
  customerType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessDto)
  @IsOptional()
  businesses?: BusinessDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteDto)
  @IsOptional()
  quotes?: QuoteDto[];
}

export class BusinessDto {
  @IsString()
  Buisness: string;

  @IsString()
  Address: string;

  @IsString()
  Address2: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @MinLength(6, { message: 'Zipcode must be at least 6 characters long' })
  Zip: string;
}

export class QuoteDto {
  @IsString()
  @MinLength(5, { message: 'quote number must be at least 5 characters long' })
  quoteNumber: string;

  @IsString()
  @MinLength(5, { message: 'policy number must be at least 5 characters long' })
  policyNumber: string;

  @IsString()
  carrierCompany: string;

  @IsString()
  wholesaler: string;

  @IsString()
  coverage: string;

  @Type(() => Date)
  @IsDate()
  effectiveDate: Date;

  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  @IsOptional()
  minDaysToCancel?: number;

  @IsOptional()
  minEarnedRate?: number;

  @IsOptional()
  premium?: number;

  @IsOptional()
  taxes?: number;

  @IsOptional()
  otherFees?: number;

  @IsOptional()
  brokerFee?: number;

  @IsOptional()
  policyFee?: number;

  @IsOptional()
  commission?: number;

  @IsOptional()
  AgencyFess?: number;

  @IsNumber()
  totalCost: number;
}

export class CreateOrganisationDetailsDto {
  @IsString()
  businessName?: string;

  @IsString()
  @MinLength(10, { message: 'Contact must be at least 10 characters long' })
  phone?: string;

  @IsString()
  email?: string;

  @IsString()
  website?: string;

  @IsString()
  streetAddress?: string;

  @IsString()
  @MinLength(9, { message: 'taxId must be at least 9 characters long' })
  taxId?: string;

  @IsString()
  type?: string;

  @IsString()
  ownerName?: string;

  @IsString()
  ownerJobTitle?: string;

  @IsString()
  ownerDOB?: string;

  @IsString()
  @MinLength(9, { message: 'ownerSSN must be at least 9 characters long' })
  ownerSSN?: string;

  @IsString()
  streetAddress2?: string;

  @IsString()
  @MinLength(10, { message: 'Contact must be at least 10 characters long' })
  ownerPhone?: string;

  @IsString()
  status?: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class BankDetailsDto {
  @IsString()
  bankAccountHolderName?: string;

  @IsString()
  @MinLength(9, { message: 'Account must be at least 9 characters long' })
  bankAccountNumber?: string;

  @IsString()
  @MinLength(9, {
    message: 'Routing number must be at least 9 characters long',
  })
  bankRoutingNumber?: string;

  @IsString()
  trustAccountHolderName?: string;

  @IsString()
  @MinLength(9, { message: 'Account must be at least 9 characters long' })
  trustAccountNumber?: string;

  @IsString()
  @MinLength(9, {
    message: 'Routing number must be at least 9 characters long',
  })
  trustRoutingNumber?: string;

  @IsString()
  Account?: string;

  document?: Buffer;
  
  OrganisationId?: string;
}
