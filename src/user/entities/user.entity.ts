// import {
//   BaseEntity,
//   BeforeInsert,
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import * as bcrypt from 'bcryptjs';

// @Entity()
// export class User extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true, nullable: false })
//   email: string;

//   @Column({ unique: true })
//   username: string;

//   @Column()
//   password: string;

//   @Column({ nullable: true })
//   verificationToken: string;

//   @Column({ default: false })
//   isVerified: boolean;

//   @Column({ nullable: true })
//   otp: string;

//   @Column({ default: 'user' })
//   role: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @BeforeInsert()
//   async hashPasswordAndValidate() {
//     this.password = await bcrypt.hash(this.password, 8);
//   }

//   async validatePassword(password: string): Promise<boolean> {
//     return bcrypt.compare(password, this.password);
//   }

//   async comparePassword(password: string): Promise<boolean> {
//     return await bcrypt.compare(password, this.password);
//   }

//   async setPassword(newPassword: string): Promise<void> {
//     this.password = await bcrypt.hash(newPassword, 10);
//   }
// }


import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  // @Column({ unique: true })
  // username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ default: 'user' })
  role: string;

  @Column()
  companyName: string;

  @Column()
  mobileNumber: string;

  @Column()
  website: string;

  @Column()
  streetAddress: string;

  @Column({ nullable: true })
  streetAddress2?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPasswordAndValidate() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async setPassword(newPassword: string): Promise<void> {
    this.password = await bcrypt.hash(newPassword, 10);
  }
}
