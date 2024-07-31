import { Body, Controller, Post } from '@nestjs/common';
import { CreateIssueDto } from '../data/dto/create.issue.dto';
import { IssuesService } from '../data/data.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post('/save')
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }
}
