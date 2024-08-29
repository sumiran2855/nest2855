import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    Logger.log(
      'Received Organisation Details:',
      JSON.stringify(createOrganisationDetailsDto),
    );
    return this.organisationDetailsService.create(createOrganisationDetailsDto);
  }

  @Get('/getUser/:userId')
  findOne(@Param('id') userId: string): Promise<OrganisationDetails> {
    return this.organisationDetailsService.findOneByUserId(userId);
  }

  @Get('/getAllUsers')
  async getAllUsers(@Req() req) {
    return this.organisationDetailsService.findAll();
  }

  @Put('/update/:userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ) {
    return this.organisationDetailsService.update(
      userId,
      updateOrganisationDetailsDto,
    );
  }

  @Put('/updateStatus/:userId')
  async updateStatus(
    @Param('userId') userId: string,
    @Body() updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    return this.organisationDetailsService.updateStatus(
      userId,
      updateOrganisationDetailsDto.status,
    );
  }
}

@Controller('bank')
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Post('/create')
  create(@Body() bankDetailsDto: BankDetailsDto) {
    Logger.log(
      'Received Organisation Details:',
      JSON.stringify(bankDetailsDto),
    );
    return this.bankDetailsService.create(bankDetailsDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('document'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBankDetailsDto: BankDetailsDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.bankDetailsService.upload(createBankDetailsDto, file);
  }

  @Get('/getUser/:userId')
  findOne(@Param('userId') userId: string): Promise<BankDetails> {
    return this.bankDetailsService.findOneByUserId(userId);
  }

  @Put('/update/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('userId') userId: string,
    @Body() UpdateBankDetailsDto: updateBankDetailsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.bankDetailsService.update(userId, UpdateBankDetailsDto, file);
  }
}
