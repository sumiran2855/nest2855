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
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { Roles } from './role/role.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from './role/roles.guard';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

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
      return res.redirect('http://localhost:3001/verify');
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    const user = await this.userService.findOneByID(userId);
    return user;
  }

  @Put('/updateProfile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'admin') {
      return {
        statusCode: 403,
        message: 'Forbidden',
      };
    }
    return this.userService.deleteUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllUsers')
  async getAllUsers(@Req() req) {
    if (req.user.role !== 'admin') {
      return {
        statusCode: 403,
        message: 'do not have permission to fetch user',
      };
    }
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('promote-to-admin/:id')
  async promoteToAdmin(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'admin') {
      return {
        statusCode: 403,
        message: 'Forbidden',
      };
    }
    return this.userService.promoteToAdmin(id);
  }
}
