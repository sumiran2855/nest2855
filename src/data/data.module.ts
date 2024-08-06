import { Module } from '@nestjs/common';
import { agreementController, IssuesController } from '../data/data.controller';
import { AgreementService, IssuesService } from '../data/data.service';
import { Issue } from './entity/Issue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from './entity/Agreement.entity';
import { OrganisationDetails } from './entity/Organisation.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Issue,Agreement,OrganisationDetails]),],
  controllers: [IssuesController,agreementController],
  providers: [IssuesService,AgreementService],
})
export class IssuesModule {}
