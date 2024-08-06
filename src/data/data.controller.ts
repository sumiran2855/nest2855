import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CreateAgreementDto,
  CreateIssueDto,
  CreateOrganisationDetailsDto,
} from '../data/dto/create.issue.dto';
import { AgreementService, IssuesService, OrganisationDetailsService } from '../data/data.service';
import { OrganisationDetails } from './entity/Organisation.entity';
import { UpdateOrganisationDetailsDto } from './dto/update.data.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post('/save')
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }
}

@Controller('agreement')
export class agreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post('/create')
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    return this.agreementService.create(createAgreementDto);
  }
}

@Controller('organisation')
export class OrganisationDetailsController {
  constructor(private readonly organisationDetailsService: OrganisationDetailsService) {}

  @Post('save')
  create(@Body() createOrganisationDetailsDto: CreateOrganisationDetailsDto): Promise<OrganisationDetails> {
    return this.organisationDetailsService.create(createOrganisationDetailsDto);
  }

  @Get()
  findAll(): Promise<OrganisationDetails[]> {
    return this.organisationDetailsService.findAll();
  }

  @Get('/getUser/:id')
  findOne(@Param('id') id: string): Promise<OrganisationDetails> {
    return this.organisationDetailsService.findOne(id);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    return this.organisationDetailsService.update(id, updateOrganisationDetailsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.organisationDetailsService.remove(id);
  }
}
