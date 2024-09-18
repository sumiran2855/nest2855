import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { OrganisationDetails } from './entities/organisation.entity';
import { BankDetails } from './entities/bankDetails.entity';
import { User } from './entities/user.entity';
import {
  AgreementService,
  BankDetailsService,
  OrganisationDetailsService,
} from '../data/data.service';
import {
  BankDetailsController,
  OrganisationDetailsController,
} from '../data/data.controller';
import { Agreement, Business, Quote } from '../data/entity/Agreement.entity';
import { IssuesModule } from '../data/data.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OrganisationDetails,
      BankDetails,
      Agreement,
      Business,
      Quote,
    ]),
    JwtModule.register({
      secret: 'sumiran9900',
    }),
    forwardRef(() => IssuesModule),
  ],
  controllers: [
    UserController,
    OrganisationDetailsController,
    BankDetailsController,
  ],
  providers: [
    UserService,
    OrganisationDetailsService,
    BankDetailsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RolesGuard,
    JwtStrategy,
    EmailService,
    AgreementService,
  ],
  exports: [AgreementService,UserService],
})
export class UserModule {}
