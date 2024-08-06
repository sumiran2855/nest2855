import { Injectable } from '@nestjs/common';
import { CreateAgreementDto, CreateIssueDto, CreateOrganisationDetailsDto } from '../data/dto/create.issue.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from './entity/Issue.entity';
import { Agreement } from './entity/Agreement.entity';
import { OrganisationDetails } from './entity/Organisation.entity';
import { UpdateOrganisationDetailsDto } from './dto/update.data.dto';

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
  ) {}

  async create(createAgreementDto: CreateAgreementDto): Promise<Agreement> {
    const newAgreement = this.agreementRepository.create(createAgreementDto);
    return this.agreementRepository.save(newAgreement);
  }
}

@Injectable()
export class OrganisationDetailsService {
  constructor(
    @InjectRepository(OrganisationDetails)
    private readonly organisationDetailsRepository: Repository<OrganisationDetails>,
  ) {}

  async create(createOrganisationDetailsDto: CreateOrganisationDetailsDto): Promise<OrganisationDetails> {
    const organisationDetails = this.organisationDetailsRepository.create(createOrganisationDetailsDto);
    return this.organisationDetailsRepository.save(organisationDetails);
  }

  async findAll(): Promise<OrganisationDetails[]> {
    return this.organisationDetailsRepository.find();
  }

  async findOne(id: string): Promise<OrganisationDetails> {
    return this.organisationDetailsRepository.findOneBy({ id });
  }

  async update(id: string, updateOrganisationDetailsDto: UpdateOrganisationDetailsDto): Promise<OrganisationDetails> {
    await this.organisationDetailsRepository.update(id, updateOrganisationDetailsDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.organisationDetailsRepository.delete(id);
  }
}