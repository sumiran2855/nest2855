import { Module } from '@nestjs/common';
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
import { BankDetailsService, OrganisationDetailsService } from '../data/data.service';
import { BankDetailsController, OrganisationDetailsController } from '../data/data.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,OrganisationDetails,BankDetails]),
    JwtModule.register({
      secret: 'sumiran9900',
    }),
  ],
  controllers: [UserController,OrganisationDetailsController,BankDetailsController],
  providers: [
    UserService,OrganisationDetailsService,BankDetailsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RolesGuard,
    JwtStrategy,
    EmailService
  ],
})
export class UserModule {}
