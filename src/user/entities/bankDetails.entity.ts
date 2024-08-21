import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @ManyToOne(() => User, (user) => user.bankDetails)
  @JoinColumn({ name: 'userId' })
  user: User;
}
