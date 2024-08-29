import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from 'jsonwebtoken';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import {
  BankDetailsDto,
  CreateOrganisationDetailsDto,
} from '../data/dto/create.issue.dto';
import {
  BankDetailsService,
  OrganisationDetailsService,
} from '../data/data.service';
import { OrganisationDetails } from './entities/organisation.entity';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private emailService: EmailService,
    private readonly organisationDetailsService: OrganisationDetailsService,
    private readonly bankDetailService: BankDetailsService,
  ) {}

  // register user
  async create(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const newUser = this.usersRepository.create(createUserDto);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const emailText = `Your verification link is: http://localhost:3000/user/verify?token=${verificationToken}`;
    await this.emailService.sendMail(
      newUser.email,
      'Email Verification',
      emailText,
    );

    newUser.verificationToken = verificationToken;
    const savedUser = await this.usersRepository.save(newUser);

    const organisationDetailsDto: CreateOrganisationDetailsDto = {
      userId: savedUser.id,
      email: createUserDto.email,
      businessName: createUserDto.businessName,
      phone: createUserDto.phone,
      website: createUserDto.website,
      streetAddress: createUserDto.streetAddress,
      ownerName: createUserDto.firstName + ' ' + createUserDto.lastName,
      ownerJobTitle: createUserDto.role,
      streetAddress2: createUserDto.streetAddress2,
      ownerPhone: createUserDto.ownerPhone,
    };

    const BankDetailsDto: BankDetailsDto = {
      userId: savedUser.id,
    };

    await this.bankDetailService.create(BankDetailsDto);

    await this.organisationDetailsService.create(organisationDetailsDto);

    const { password, ...result } = savedUser;
    return { user: result };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException(
        'Verification token is invalid or has expired',
      );
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.usersRepository.save(user);

    const congratsEmailText =
      'Congratulations, your email has been verified successfully!';
    await this.emailService.sendMail(
      user.email,
      'Email Verified',
      congratsEmailText,
    );

    return { message: 'User verified successfully' };
  }

  //find user by Id
  async findOneByID(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // get by email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // to get profile
  async getProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // update using update dto
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  // delete using id
  async deleteUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.remove(user);
    return user;
  }

  // get all
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // reset password
  async ResetPassword(id: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.password = newPassword;
    await this.usersRepository.save(user);
  }

  // promote to admin
  async promoteToAdmin(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.role = 'admin';
    await this.usersRepository.save(user);

    return user;
  }

  // validate jwt token
  async validateUserByJwt(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
