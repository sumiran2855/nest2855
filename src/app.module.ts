import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { IssuesModule } from './data/data.module';
import { Issue } from './data/entity/Issue.entity';
import { Agreement, Business, Quote } from './data/entity/Agreement.entity';
// import { OrganisationDetails } from './data/entity/Organisation.entity';
// import { BankDetails } from './data/entity/bankDetails.entity';
import { OrganisationDetails } from './user/entities/organisation.entity';
import { BankDetails } from './user/entities/bankDetails.entity';



const entities = [User,Issue,Agreement,OrganisationDetails,BankDetails,Business,Quote];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities: entities,
    }),
    UserModule,
    AuthModule,
    IssuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
