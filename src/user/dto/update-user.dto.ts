import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { OrganisationDetails } from '../entities/organisation.entity';
import { BankDetails } from '../entities/bankDetails.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateOrganisationDetailsDto extends PartialType(OrganisationDetails) {}
export class updateBankDetailsDto extends PartialType(BankDetails){}


export { CreateUserDto };
