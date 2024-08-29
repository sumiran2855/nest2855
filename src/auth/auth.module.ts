import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EmailService } from '../email/email.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../user/role/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BankDetailsService, OrganisationDetailsService } from '../data/data.service';
import { OrganisationDetails } from '../user/entities/organisation.entity';
import { BankDetails } from '../user/entities/bankDetails.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
    TypeOrmModule.forFeature([User,OrganisationDetails,BankDetails]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    EmailService,
    OrganisationDetailsService,
    BankDetailsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
