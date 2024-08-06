import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrganisationDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessName: string;

  @Column()
  phone: string;

  @Column()
  website: string;

  @Column()
  address: string;

  @Column()
  taxId: string;

  @Column()
  type: string;

  @Column()
  ownerName: string;

  @Column()
  ownerJobTitle: string;

  @Column()
  ownerDOB: string;

  @Column()
  ownerSSN: string;

  @Column()
  ownerAddress: string;

  @Column()
  ownerPhone: string;

  @Column()
  bankAccountHolderName: string;

  @Column()
  bankAccountNumber: string;

  @Column()
  bankRoutingNumber: string;

  @Column()
  trustAccountHolderName: string;

  @Column()
  trustAccountNumber: string;

  @Column()
  trustRoutingNumber: string;

  @Column()
  oneTimePaymentRoutingNumber: string;
}
