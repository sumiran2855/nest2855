import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from './role/role.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from './role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post('/register/verify')
  async verifyRegistration(
    @Body() verificationDto: { email: string; otp: string },
  ): Promise<{ message: string }> {
    const { email, otp } = verificationDto;

    const isOTPVerified = await this.userService.verifyOTP(email, otp);

    if (!isOTPVerified) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return { message: 'User registered successfully' };
  }

  @Get('getUser/:id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findOneByID(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Get('username/:username')
  async findByUsername(@Param('email') username: string): Promise<User> {
    return this.userService.findOneByUsername(username);
  }

  @Put('updateUser/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('deleteUser/:id')
  @Roles('admin')
  @UseGuards(RolesGuard, JwtAuthGuard)
  async removeUser(@Param('id') id: string) {
    await this.userService.deleteUserById(id);
    return { message: 'User deleted successfully' };
  }

  @Post('promote-to-admin/:id')
  @Roles('admin')
  @UseGuards(RolesGuard, JwtAuthGuard)
  async promoteToAdmin(@Param('id') id: string): Promise<User> {
    return this.userService.promoteToAdmin(id);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RolesGuard, JwtAuthGuard)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
