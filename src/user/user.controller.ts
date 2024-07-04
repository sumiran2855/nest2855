import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { Roles } from '../user/role/role.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from './role/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findOne({ id });
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findOne({ email });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin') 
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Post('promote-to-admin/:id')
  @Roles('admin') 
  @UseGuards(RolesGuard)
  async promoteToAdmin(@Param('id') id: string): Promise<User> {
    return this.userService.promoteToAdmin(id);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
