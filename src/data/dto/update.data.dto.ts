
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganisationDetailsDto } from './create.issue.dto';

export class UpdateOrganisationDetailsDto extends PartialType(CreateOrganisationDetailsDto) {}
