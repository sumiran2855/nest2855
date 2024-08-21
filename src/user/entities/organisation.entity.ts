import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class OrganisationDetails {
  @PrimaryGeneratedColumn('uuid')
  OrganisationId: string;

  @Column({ name: 'businessName', nullable: true })
  businessName?: string;

  @Column({ name: 'phone', nullable: true })
  phone?: string;

  @Column({ name: 'website', nullable: true })
  website?: string;

  @Column({ name: 'ownerName', nullable: true })
  ownerName?: string;

  @Column({ name: 'address', nullable: true })
  address?: string;

  @Column({ name: 'ownerAddress', nullable: true })
  ownerAddress?: string;

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

  @ManyToOne(() => User, (user) => user.businesses)
  @JoinColumn({ name: 'userId' })
  user: User;
}
