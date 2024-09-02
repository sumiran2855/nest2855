// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { User } from './user.entity';
// import { OrganisationDetails } from './organisation.entity';

// @Entity()
// export class BankDetails {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ name: 'bankAccountHolderName', nullable: true })
//   bankAccountHolderName?: string;

//   @Column({ name: 'bankAccountNumber', nullable: true })
//   bankAccountNumber?: string;

//   @Column({ name: 'bankRoutingNumber', nullable: true })
//   bankRoutingNumber?: string;

//   @Column({ name: 'trustAccountHolderName', nullable: true })
//   trustAccountHolderName?: string;

//   @Column({ name: 'trustAccountNumber', nullable: true })
//   trustAccountNumber?: string;

//   @Column({ name: 'trustRoutingNumber', nullable: true })
//   trustRoutingNumber?: string;

//   @Column({ name: 'Account', nullable: true })
//   Account?: string;

//   @Column('blob', { nullable: true })
//   document?: Buffer;

//   @ManyToOne(() => OrganisationDetails, (user) => user.bankDetails, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'OrganisationId' })
//   user?: User;

// }


import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrganisationDetails } from './organisation.entity';

@Entity()
export class BankDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bankAccountHolderName', nullable: true })
  bankAccountHolderName?: string;

  @Column({ name: 'bankAccountNumber', nullable: true })
  bankAccountNumber?: string;

  @Column({ name: 'bankRoutingNumber', nullable: true })
  bankRoutingNumber?: string;

  @Column({ name: 'trustAccountHolderName', nullable: true })
  trustAccountHolderName?: string;

  @Column({ name: 'trustAccountNumber', nullable: true })
  trustAccountNumber?: string;

  @Column({ name: 'trustRoutingNumber', nullable: true })
  trustRoutingNumber?: string;

  @Column({ name: 'Account', nullable: true })
  Account?: string;

  @Column('blob', { nullable: true })
  document?: Buffer;

  @ManyToOne(() => OrganisationDetails, (organisation) => organisation.bankDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OrganisationId' }) 
  organisation: OrganisationDetails;
}
