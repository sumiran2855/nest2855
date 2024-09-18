
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BankDetails } from './bankDetails.entity';

@Entity()
export class OrganisationDetails {
  @PrimaryGeneratedColumn('uuid')
  organisationId: string;

  @Column({ name: 'businessName', nullable: true })
  businessName?: string;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @Column({ name: 'phone', nullable: true })
  phone?: string;

  @Column({ name: 'website', nullable: true })
  website?: string;

  @Column({ name: 'ownerName', nullable: true })
  ownerName?: string;

  @Column({ name: 'address', nullable: true })
  streetAddress?: string;

  @Column({ name: 'ownerAddress', nullable: true })
  streetAddress2?: string;

  @Column({ name: 'ownerJobTitle', nullable: true })
  ownerJobTitle?: string;

  @Column({ name: 'ownerDOB', nullable: true })
  ownerDOB?: string;

  @Column({ name: 'ownerSSN', nullable: true })
  ownerSSN?: string;

  @Column({ name: 'TaxId', nullable: true })
  taxId?: string;

  @Column({ name: 'Type', nullable: true })
  type?: string;

  @Column({ name: 'ownerPhone', nullable: true })
  ownerPhone?: string;

  @Column({ nullable: true, default: 'pending' })
  status?: string;

  @ManyToOne(() => User, (user) => user.businesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => BankDetails, (bankDetails) => bankDetails.organisation)
  bankDetails: BankDetails[];
}
