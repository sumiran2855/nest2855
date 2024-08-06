import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Agreement {
  @PrimaryGeneratedColumn()
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
  zipcode: string;

  @Column()
  customerType: string;

  @Column('json', { nullable: true })
  businesses: Array<{
    Buisness: string;
    Address: string;
    Address2: string;
    city: string;
    state: string;
    Zip: string;
  }>;

  @Column('json', { nullable: true })
  quotes: Array<{
    quoteNumber: string;
    policyNumber: string;
    carrierCompany: string;
    wholesaler: string;
    coverage: string;
    effectiveDate: Date;
    expirationDate: Date;
    minDaysToCancel: number;
    minEarnedRate: number;
    premium: number;
    taxes: number;
    otherFees: number;
    brokerFee: number;
    policyFee: number;
    commission: number;
    AgencyFess: number;
  }>;
}
