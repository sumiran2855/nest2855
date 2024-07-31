import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from '../data/dto/create.issue.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from './entity/Issue.entity';

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