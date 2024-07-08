import {
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

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Register
  async create(createUserDto: CreateUserDto): Promise<any> {
    const newUser: User = this.usersRepository.create(createUserDto);
    const savedUser: User = await this.usersRepository.save(newUser);
    const { password, ...result } = savedUser;
    return { user: result };
  }

  //find user by Id
  async findOneByID(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // get by Id, email, username
  async findOne(criteria: {
    id?: string;
    email?: string;
    username?: string;
  }): Promise<User> {
    const { id, email, username } = criteria;
    let user: any;

    switch (true) {
      case !!id:
        this.logger.debug(`Finding user by ID: ${id}`);
        user = await this.usersRepository.findOne({ where: { id } });
        break;
      case !!email:
        this.logger.debug(`Finding user by email: ${email}`);
        user = await this.usersRepository.findOne({ where: { email } });
        break;
      case !!username:
        this.logger.debug(`Finding user by username: ${username}`);
        user = await this.usersRepository.findOne({ where: { username } });
        break;
      default:
        throw new NotFoundException(
          `User not found with criteria: ${JSON.stringify(criteria)}`,
        );
    }

    if (!user) {
      throw new NotFoundException(
        `User not found with criteria: ${JSON.stringify(criteria)}`,
      );
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
    return await this.usersRepository.find();
  }

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
