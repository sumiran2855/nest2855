import { Module } from '@nestjs/common';
import { IssuesController } from '../data/data.controller';
import { IssuesService } from '../data/data.service';
import { Issue } from './entity/Issue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Issue]),],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
