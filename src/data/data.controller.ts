import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
} from '@nestjs/common';
import {
  BankDetailsDto,
  CreateAgreementDto,
  CreateIssueDto,
  CreateOrganisationDetailsDto,
} from '../data/dto/create.issue.dto';
import {
  AgreementService,
  BankDetailsService,
  IssuesService,
  OrganisationDetailsService,
} from '../data/data.service';
import { BankDetails } from '../user/entities/bankDetails.entity';
import { OrganisationDetails } from '../user/entities/organisation.entity';
import {
  updateBankDetailsDto,
  UpdateOrganisationDetailsDto,
} from 'src/user/dto/update-user.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post('/save')
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }
}

@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Post('/create')
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    try {
      return this.agreementService.create(createAgreementDto);
    } catch (error) {
      console.error('Error creating agreement:', error);
      throw new BadRequestException('Invalid data provided');
    }
  }
}
@Controller('organisation')
export class OrganisationDetailsController {
  constructor(
    private readonly organisationDetailsService: OrganisationDetailsService,
  ) {}

  @Post('/save')
  create(@Body() createOrganisationDetailsDto: CreateOrganisationDetailsDto) {
    return this.organisationDetailsService.create(createOrganisationDetailsDto);
  }

  @Get('/getUser/:userId')
  findOne(@Param('id') userId: string): Promise<OrganisationDetails> {
    return this.organisationDetailsService.findOneByUserId(userId);
  }

  @Put('/update/:OrganisationId')
  async update(
    @Param('OrganisationId') OrganisationId: string,
    @Body() updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ) {
    return this.organisationDetailsService.update(
      OrganisationId,
      updateOrganisationDetailsDto,
    );
  }
}

@Controller('bank')
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Post('/create')
  async create(@Body() bankDetailsDto: BankDetailsDto) {
    return this.bankDetailsService.create(bankDetailsDto);
  }

  @Get('/getUser/:userId')
  findOne(@Param('id') userId: string): Promise<BankDetails> {
    return this.bankDetailsService.findOneByUserId(userId);
  }

  @Put('/update/:userId')
  update(
    // @Param('userId') userId: string,
    @Request() req,
    @Body() UpdateBankDetailsDto: updateBankDetailsDto,
  ): Promise<BankDetails> {
    const userId = req.user.id;
    return this.bankDetailsService.updateByUserId(userId, UpdateBankDetailsDto);
  }
}
