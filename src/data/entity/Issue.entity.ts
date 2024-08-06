import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { BusinessDto, QuoteDto } from '../dto/create.issue.dto';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}


