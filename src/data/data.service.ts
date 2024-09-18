import {
  BadRequestException,
  forwardRef,
  Inject,
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
  CreateUserDto,
  UpdateOrganisationDetailsDto,
  updateBankDetailsDto,
} from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';
import * as ejs from 'ejs';
import { join } from 'path';
import * as nodemailer from 'nodemailer';

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
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(Agreement)
    private agreementRepository: Repository<Agreement>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'biswasnikhil975@gmail.com',
        pass: 'hvrthxozpizbpsth',
      },
    });
  }

  async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
    try {
      const { userId, ...agreementData } = createAgreementDto;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const newAgreement = this.agreementRepository.create({
        ...agreementData,
        user: user,
      });
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

      const premium = Number(quote.premium) || 0;
      const taxes = Number(quote.taxes) || 0;
      const otherFees = Number(quote.otherFees) || 0;
      const brokerFee = Number(quote.brokerFee) || 0;
      const policyFee = Number(quote.policyFee) || 0;
      const commissionRate = Number(quote.minEarnedRate) || 0;
      const commission = premium * (commissionRate / 100);
      const AgencyFess = Number(quote.AgencyFess) || 0;

      quote.totalCost =
        premium +
        taxes +
        otherFees +
        brokerFee +
        policyFee +
        commission +
        AgencyFess;

      return quote;
    });

    return this.quoteRepository.save(quotes);
  }

  async getAgreementsByUserId(userId: string): Promise<Agreement[]> {
    try {
      const agreements = await this.agreementRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'quotes'],
        order: { createdAt: 'DESC' },
      });
      console.log(userId);

      return agreements;
    } catch (error) {
      console.error('Error fetching agreements:', error);
      throw new Error('Unable to fetch agreements');
    }
  }

  async getUserEmailFromAgreement(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['agreements'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.email;
  }

  async sendAgreementEmail(userId: string): Promise<void> {
    try {
      const recipientEmail = await this.userService.getUserEmailById(userId);

      const emailTemplatePath = join(
        // __dirname,
        process.cwd(),
        'src',
        'email',
        'sendAgreement.ejs',
      );

      const htmlContent = await ejs.renderFile(emailTemplatePath, {});

      await this.transporter.sendMail({
        from: 'sumiran.b@cisinlabs.com',
        to: recipientEmail,
        subject: 'Your Agreement Details',
        html: htmlContent,
      });

      console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
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

    if (updateOrganisationDetailsDto.businessName) {
      organisationDetails.user.businessName =
        updateOrganisationDetailsDto.businessName;
      await this.usersRepository.save(organisationDetails.user); // Save the user entity
    }
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
      relations: ['organisation'],
    });

    if (!bankDetails) {
      throw new NotFoundException(
        'Bank details not found for this organisation.',
      );
    }

    const organisation = await this.organisationDetailsRepository.findOne({
      where: { organisationId },
      relations: ['user'],
    });

    if (!organisation) {
      throw new NotFoundException('Organisation not found.');
    }

    const userId = organisation.user.id;

    Object.assign(bankDetails, updateBankDetailsDto);

    if (file) {
      bankDetails.document = file.buffer;
    }

    await this.bankDetailsRepository.save(bankDetails);

    return bankDetails;
  }
}
