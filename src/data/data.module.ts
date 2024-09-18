import { forwardRef, Module } from '@nestjs/common';
import { AgreementController, BankDetailsController, IssuesController, OrganisationDetailsController } from '../data/data.controller';
import { AgreementService, BankDetailsService, IssuesService, OrganisationDetailsService } from '../data/data.service';
import { Issue } from './entity/Issue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement, Business, Quote } from './entity/Agreement.entity';
import { User } from '../user/entities/user.entity';
import { BankDetails } from '../user/entities/bankDetails.entity';
import { OrganisationDetails } from '../user/entities/organisation.entity';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Issue,Agreement,OrganisationDetails,BankDetails,Business,Quote,User]),forwardRef(() => UserModule),],
  controllers: [IssuesController,AgreementController,OrganisationDetailsController,BankDetailsController],
  providers: [IssuesService,AgreementService,OrganisationDetailsService,BankDetailsService,EmailService,UserService],

})
export class IssuesModule {}
