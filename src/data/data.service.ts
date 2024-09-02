import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BankDetailsDto,
  BusinessDto,
  CreateAgreementDto,
  CreateIssueDto,
  CreateOrganisationDetailsDto,
  QuoteDto,
} from '../data/dto/create.issue.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from './entity/Issue.entity';
import { Agreement, Business, Quote } from './entity/Agreement.entity';
import { BankDetails } from '../user/entities/bankDetails.entity';
import { User } from '../user/entities/user.entity';
import { OrganisationDetails } from 'src/user/entities/organisation.entity';
import {
  UpdateOrganisationDetailsDto,
  updateBankDetailsDto,
} from 'src/user/dto/update-user.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issuesRepository: Repository<Issue>,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const newIssue = this.issuesRepository.create(createIssueDto);
    return this.issuesRepository.save(newIssue);
  }
}

@Injectable()
export class AgreementService {
  constructor(
    @InjectRepository(Agreement)
    private agreementRepository: Repository<Agreement>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
  ) {}

  async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
    try {
      const newAgreement = this.agreementRepository.create(createAgreementDto);
      const savedAgreement = await this.agreementRepository.save(newAgreement);

      if (createAgreementDto.businesses) {
        await this.createOrUpdateBusinesses(
          createAgreementDto.businesses,
          savedAgreement.id,
        );
      }

      if (createAgreementDto.quotes) {
        const quotes = createAgreementDto.quotes.map((quoteDto) => ({
          ...quoteDto,
          effectiveDate: quoteDto.effectiveDate
            ? new Date(quoteDto.effectiveDate)
            : null,
          expirationDate: quoteDto.expirationDate
            ? new Date(quoteDto.expirationDate)
            : null,
        }));
        await this.createOrUpdateQuotes(quotes, savedAgreement.id);
      }

      return savedAgreement;
    } catch (error) {
      console.error('Error creating agreement:', error);
      throw new BadRequestException('Invalid request data');
    }
  }

  private async createOrUpdateBusinesses(
    businessesDto: BusinessDto[],
    agreementId: number,
  ): Promise<Business[]> {
    const businesses: Business[] = businessesDto.map((businessDto) => {
      const business = new Business();
      business.Buisness = businessDto.Buisness;
      business.Address = businessDto.Address;
      business.Address2 = businessDto.Address2;
      business.city = businessDto.city;
      business.state = businessDto.state;
      business.Zip = businessDto.Zip;
      business.agreement = { id: agreementId } as Agreement;
      return business;
    });

    return this.businessRepository.save(businesses);
  }

  private async createOrUpdateQuotes(
    quotesDto: QuoteDto[],
    agreementId: number,
  ): Promise<Quote[]> {
    const quotes: Quote[] = quotesDto.map((quoteDto) => {
      const quote = new Quote();
      quote.quoteNumber = quoteDto.quoteNumber;
      quote.policyNumber = quoteDto.policyNumber;
      quote.carrierCompany = quoteDto.carrierCompany;
      quote.wholesaler = quoteDto.wholesaler;
      quote.coverage = quoteDto.coverage;
      quote.effectiveDate = quoteDto.effectiveDate;
      quote.expirationDate = quoteDto.expirationDate;
      quote.minDaysToCancel = quoteDto.minDaysToCancel;
      quote.minEarnedRate = quoteDto.minEarnedRate;
      quote.premium = quoteDto.premium;
      quote.taxes = quoteDto.taxes;
      quote.otherFees = quoteDto.otherFees;
      quote.brokerFee = quoteDto.brokerFee;
      quote.policyFee = quoteDto.policyFee;
      quote.commission = quoteDto.commission;
      quote.AgencyFess = quoteDto.AgencyFess;
      quote.agreement = { id: agreementId } as Agreement;
      return quote;
    });

    return this.quoteRepository.save(quotes);
  }
}

@Injectable()
export class OrganisationDetailsService {
  constructor(
    @InjectRepository(OrganisationDetails)
    private readonly organisationDetailsRepository: Repository<OrganisationDetails>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createOrganisationDetailsDto: CreateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    const { userId, ...rest } = createOrganisationDetailsDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const organisationDetails = this.organisationDetailsRepository.create({
      ...rest,
      user,
    });
    return this.organisationDetailsRepository.save(organisationDetails);
  }

  async findAll(): Promise<OrganisationDetails[]> {
    return this.organisationDetailsRepository.find();
  }

  async findOneByUserId(userId: string): Promise<OrganisationDetails> {
    return this.organisationDetailsRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(
    userId: string,
    updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    const organisationDetails =
      await this.organisationDetailsRepository.findOne({
        where: { user: { id: userId } },
      });

    if (!organisationDetails) {
      throw new Error('Organisation details not found for this user.');
    }

    Object.assign(organisationDetails, updateOrganisationDetailsDto);
    await this.organisationDetailsRepository.save(organisationDetails);

    return organisationDetails;
  }

  async updateStatus(
    userId: string,
    status: string,
  ): Promise<OrganisationDetails> {
    const organisationDetails =
      await this.organisationDetailsRepository.findOne({
        where: { user: { id: userId } },
      });

    if (!organisationDetails) {
      throw new Error('Organisation details not found for this user.');
    }

    organisationDetails.status = 'verified';
    await this.organisationDetailsRepository.save(organisationDetails);

    return organisationDetails;
  }
}

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectRepository(BankDetails)
    private readonly bankDetailsRepository: Repository<BankDetails>,
    @InjectRepository(OrganisationDetails)
    private readonly organisationDetailsRepository: Repository<OrganisationDetails>,
  ) {}

  async create(createBankDto: BankDetailsDto): Promise<BankDetails> {
    const { OrganisationId, ...rest } = createBankDto;

    const organisation = await this.organisationDetailsRepository.findOne({
      where: { organisationId: OrganisationId },
    });
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }

    const bankDetails = this.bankDetailsRepository.create({
      ...rest,
      organisation,
    });
    return this.bankDetailsRepository.save(bankDetails);
  }

  async upload(
    createBankDetailsDto: BankDetailsDto,
    file: Express.Multer.File,
  ): Promise<BankDetails> {
    const { OrganisationId, ...rest } = createBankDetailsDto;

    const organisation = await this.organisationDetailsRepository.findOne({
      where: { organisationId: OrganisationId },
    });
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }

    const bankDetails = this.bankDetailsRepository.create({
      ...rest,
      organisation,
      document: file.buffer,
    });
    return this.bankDetailsRepository.save(bankDetails);
  }

  async findOneByUserId(userId: string): Promise<BankDetails> {
    return this.bankDetailsRepository.findOne({
      where: {
        organisation: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['organisation', 'organisation.user'],
    });
  }

  async update(
    organisationId: string,
    updateBankDetailsDto: updateBankDetailsDto,
    file?: Express.Multer.File,
  ): Promise<BankDetails> {
    const bankDetails = await this.bankDetailsRepository.findOne({
      where: { organisation: { organisationId } },
    });

    if (!bankDetails) {
      throw new NotFoundException(
        'Bank details not found for this organisation.',
      );
    }

    Object.assign(bankDetails, updateBankDetailsDto);

    if (file) {
      bankDetails.document = file.buffer;
    }

    await this.bankDetailsRepository.save(bankDetails);

    return bankDetails;
  }
}
