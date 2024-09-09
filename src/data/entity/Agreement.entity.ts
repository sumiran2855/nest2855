import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  contact: string;

  @Column()
  Address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipcode?: string;

  @Column()
  delegateEmail?: string;

  @Column()
  delegateFirstname?: string;
  
  @Column()
  delegateLastname?: string;

  @Column()
  delegateContact?: string;

  @Column()
  customerType: string;

  @CreateDateColumn()
  createdAt: Date; 

  @ManyToOne(() => User, (user) => user.agreements)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Business, (business) => business.agreement)
  businesses: Business[];

  @OneToMany(() => Quote, (quote) => quote.agreement)
  quotes: Quote[];
}

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Buisness?: string;

  @Column()
  Address?: string;

  @Column()
  Address2?: string;

  @Column()
  city?: string;

  @Column()
  state?: string;

  @Column()
  Zip?: string;

  @ManyToOne(() => Agreement, (agreement) => agreement.businesses)
  agreement?: Agreement;
}

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quoteNumber: string;

  @Column()
  policyNumber: string;

  @Column()
  carrierCompany: string;

  @Column()
  wholesaler: string;

  @Column()
  coverage: string;

  @Column()
  effectiveDate: Date;

  @Column()
  expirationDate: Date;

  @Column()
  minDaysToCancel: number;

  @Column()
  minEarnedRate: number;

  @Column()
  premium: number;

  @Column()
  taxes: number;

  @Column()
  otherFees: number;

  @Column()
  brokerFee: number;

  @Column()
  policyFee: number;

  @Column()
  commission: number;

  @Column()
  AgencyFess: number;

  @Column('float', { default: 0 })
  totalCost: number;

  @ManyToOne(() => Agreement, (agreement) => agreement.quotes)
  agreement: Agreement;
}
