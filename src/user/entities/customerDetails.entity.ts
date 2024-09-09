import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { OrganisationDetails } from './organisation.entity';
  import { BankDetails } from './bankDetails.entity';
  import { User } from './user.entity';
  
  @Entity()
  export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    businessName: string;

    @Column()
    contact: number;
  
    @Column()
    role: string;
  
    @ManyToOne(() => OrganisationDetails, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'organisationId' })
    organisation: OrganisationDetails;
  
    @ManyToOne(() => BankDetails, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'bankId' })
    bankDetails: BankDetails;
  
    @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
  }
  