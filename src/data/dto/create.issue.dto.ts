import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from 'class-validator';
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
  @MinLength(6, { message: 'Contact must be at least 6 characters long' })
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
  Zip: string;
}

export class QuoteDto {
  @IsString()
  quoteNumber: string;

  @IsString()
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
  phone?: string;

  @IsString()
  email?: string;

  @IsString()
  website?: string;

  @IsString()
  streetAddress?: string;

  @IsString()
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
  ownerSSN?: string;

  @IsString()
  streetAddress2?: string;

  @IsString()
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
  bankAccountNumber?: string;

  @IsString()
  bankRoutingNumber?: string;

  @IsString()
  trustAccountHolderName?: string;

  @IsString()
  trustAccountNumber?: string;

  @IsString()
  trustRoutingNumber?: string;

  @IsString()
  Account?: string;

  userId?: string;
}
