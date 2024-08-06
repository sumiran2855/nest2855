import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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
  contact: string;

  @IsString()
  Address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipcode: string;

  @IsString()
  customerType: string;

  @IsArray()
  businesses: Array<{
    Buisness: string;
    Address: string;
    Address2: string;
    city: string;
    state: string;
    Zip: string;
  }>;

  @IsArray()
  quotes: Array<{
    quoteNumber: string;
    policyNumber: string;
    carrierCompany: string;
    wholesaler: string;
    coverage: string;
    effectiveDate: Date;
    expirationDate: Date;
    minDaysToCancel: number;
    minEarnedRate: number;
    premium: number;
    taxes: number;
    otherFees: number;
    brokerFee: number;
    policyFee: number;
    commission: number;
    AgencyFess: number;
  }>;
}

export class CreateOrganisationDetailsDto {
  @IsString()
  businessName: string;

  @IsString()
  phone: string;

  @IsString()
  website: string;

  @IsString()
  address: string;

  @IsString()
  taxId: string;

  @IsString()
  type: string;

  @IsString()
  ownerName: string;

  @IsString()
  ownerJobTitle: string;

  @IsString()
  ownerDOB: string;

  @IsString()
  ownerSSN: string;

  @IsString()
  ownerAddress: string;

  @IsString()
  ownerPhone: string;

  @IsString()
  bankAccountHolderName: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  bankRoutingNumber: string;

  @IsString()
  trustAccountHolderName: string;

  @IsString()
  trustAccountNumber: string;

  @IsString()
  trustRoutingNumber: string;

  @IsString()
  oneTimePaymentRoutingNumber: string;
}