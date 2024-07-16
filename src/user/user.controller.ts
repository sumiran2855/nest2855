import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Query,
  Res,
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

  @Get('/verify')
  async verifyEmail(@Query('token') token: string, @Res() res): Promise<void> {
    const isVerified = await this.userService.verifyEmail(token);
    if (isVerified) {
      return res.redirect('http://localhost:5173/verify');
    } 
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

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<User> {
    const userId = req.user.id;
    return this.userService.getProfile(userId);
  }

  @Put('/updateProfile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
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
