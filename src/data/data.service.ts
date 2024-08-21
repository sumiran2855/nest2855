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
  ) {}

  async create(
    createOrganisationDetailsDto: CreateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    const organisationDetails = this.organisationDetailsRepository.create(
      createOrganisationDetailsDto,
    );
    return this.organisationDetailsRepository.save(organisationDetails);
  }

  async findAll(): Promise<OrganisationDetails[]> {
    return this.organisationDetailsRepository.find();
  }

  async findOneByUserId(OrganisationId: string): Promise<OrganisationDetails> {
    return this.organisationDetailsRepository.findOneBy({ OrganisationId });
  }

  async update(
    OrganisationId: string,
    updateOrganisationDetailsDto: UpdateOrganisationDetailsDto,
  ): Promise<OrganisationDetails> {
    const organisationDetails =
      await this.organisationDetailsRepository.findOneBy({ OrganisationId });
    if (!organisationDetails) {
      throw new Error('Organisation not found');
    }
    Object.assign(organisationDetails, updateOrganisationDetailsDto);
    await this.organisationDetailsRepository.save(organisationDetails);

    return organisationDetails;
  }
}

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectRepository(BankDetails)
    private BankDetailsRepository: Repository<BankDetails>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createBankDto: BankDetailsDto): Promise<BankDetails> {
    const newBankDetails = this.BankDetailsRepository.create(createBankDto);
    return this.BankDetailsRepository.save(newBankDetails);
  }

  async findOneByUserId(id: string): Promise<BankDetails> {
    return this.BankDetailsRepository.findOneBy({ id });
  }

  async updateByUserId(
    userId: string,
    updateBankDetailsDto: updateBankDetailsDto,
  ): Promise<BankDetails> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let bankDetails = await this.BankDetailsRepository.findOne({
      where: { id: userId },
    });

    if (!bankDetails) {
      throw new NotFoundException(`Bank details not found for user ${userId}`);
    }

    Object.assign(bankDetails, updateBankDetailsDto);
    return await this.BankDetailsRepository.save(bankDetails);
  }
}
